################################################################################
#
# S3 functions that do NOT depend on Django models.
#
# This file may be imported in model definitions.  Therefore no models may be
# imported here, to avoid circular dependency.
#
################################################################################
import os
import boto3
import botocore.client
from django.urls import reverse
from django.conf import settings
from loguru import logger
from attr import dataclass


@dataclass
class S3Object:
    modified: object
    permission: str
    type: str
    name: str
    url: str
    bucket: str
    size: str
    key: str
    folder: bool
    is_owner: bool


def presigned_url(s3_object) -> str:
    """
    Generate a presigned URL allowing secure access to an S3 object
    """
    session = boto3.Session(settings.AWS_ACCESS_KEY, settings.AWS_SECRET_ACCESS_KEY)
    s3 = session.client('s3')
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": s3_object.bucket_name, "Key": s3_object.key},
        ExpiresIn=settings.S3_URL_EXPIRATION
    )


def list_user_folder(user, request=None):
    """
    Yield the contents - both files and subfolders - of the current folder.
    Do NOT yield contents of subfolders.
    """
    is_owner = user == request.user
    logger.debug("Listing seller S3 bucket objects.")
    bucket = user.company.bucket_object
    session = boto3.Session(settings.AWS_ACCESS_KEY, settings.AWS_SECRET_ACCESS_KEY)
    s3_client = session.client("s3")
    try:
        s3_client.head_bucket(Bucket=bucket.name)
        # If no exception was thrown, this bucket already exists and belongs to us
    except botocore.exceptions.ClientError:
        logger.warning("Bucket does not exist: {}", bucket.name)
        return []

    # S3's folder listing behavior is a little wonky - probably because in
    # the underlying key-value datastore, folders don't really exist.  S3
    # only returns folder objects for _empty_ folders.  If a folder contains
    # files, only the file objects are returned, no folder.
    subfolder_set = set([""])  # S3 folders under the current prefix
    private_prefix = '%s/private' % user.folder_name
    public_prefix = '%s/public' % user.folder_name
    filter_private_prefix = private_prefix + "/"
    filter_public_prefix = public_prefix + "/"
    prefix_len = len(os.path.dirname(filter_public_prefix).split("/"))
    max_depth = prefix_len + 1  # We only want objects from the current folder
    subfolder_depth = prefix_len + 1
    for s3_obj in bucket.objects.filter(Prefix=filter_private_prefix):
        key: str = s3_obj.key
        foldername = os.path.dirname(key)
        foldername_parts = foldername.split("/")
        subfolder_parts = foldername_parts[:subfolder_depth]
        subfolder = "/".join(subfolder_parts)
        key_parts = key.split("/")
        depth = len(key_parts)
        if subfolder not in subfolder_set:
            subfolder_set.add(subfolder)
            if filter_private_prefix == key[:-1] or filter_public_prefix == key[:-1]:
                continue
            if len(subfolder_parts) == subfolder_depth:
                yield S3Object(
                    name=subfolder_parts[-1],
                    bucket=bucket.name,
                    type='folder',
                    size='',
                    url='',
                    permission='private',
                    modified=s3_obj.last_modified,
                    key=subfolder,
                    folder=True,
                    is_owner=is_owner
                )
        if depth > max_depth:
            continue
        if key.endswith("/"):  # Folder
            continue
        url = presigned_url(s3_obj)
        yield S3Object(name=s3_obj.key.split("/")[-1], type='document', bucket=bucket.name, permission='private',
                       modified=s3_obj.last_modified, size=format_bytes(s3_obj.size), key=key, url=url, folder=False,
                       is_owner=is_owner)

    for s3_obj in bucket.objects.filter(Prefix=filter_public_prefix):
        key: str = s3_obj.key
        foldername = os.path.dirname(key)
        foldername_parts = foldername.split("/")
        subfolder_parts = foldername_parts[:subfolder_depth]
        subfolder = "/".join(subfolder_parts)
        key_parts = key.split("/")
        depth = len(key_parts)
        if subfolder not in subfolder_set:
            subfolder_set.add(subfolder)
            if filter_private_prefix == key[:-1] or filter_public_prefix == key[:-1]:
                continue
            if len(subfolder_parts) == subfolder_depth:
                yield S3Object(
                    name=subfolder_parts[-1],
                    bucket=bucket.name,
                    type='folder',
                    size='',
                    url='',
                    permission='public',
                    modified=s3_obj.last_modified,
                    key=subfolder,
                    folder=True,
                    is_owner=is_owner
                )
        if depth > max_depth:
            continue
        if key.endswith("/"):  # Folder
            continue
        url = presigned_url(s3_obj)
        yield S3Object(name=s3_obj.key.split("/")[-1], type='document', bucket=bucket.name, permission='public',
                       modified=s3_obj.last_modified, size=format_bytes(s3_obj.size), key=key, url=url, folder=False,
                       is_owner=is_owner)

    subfolder_set = set([""])  # S3 folders under the current prefix
    filter_prefix = "share/"
    prefix_len = len(os.path.dirname(filter_prefix).split("/"))
    max_depth = prefix_len + 1  # We only want objects from the current folder
    subfolder_depth = prefix_len + 1
    for s3_obj in bucket.objects.filter(Prefix=filter_prefix):
        key: str = s3_obj.key
        foldername = os.path.dirname(key)
        foldername_parts = foldername.split("/")
        subfolder_parts = foldername_parts[:subfolder_depth]
        subfolder = "/".join(subfolder_parts)
        key_parts = key.split("/")
        depth = len(key_parts)
        if subfolder not in subfolder_set:
            subfolder_set.add(subfolder)
            if filter_prefix == key[:-1]:
                continue
            if len(subfolder_parts) == subfolder_depth:
                yield S3Object(
                    name=subfolder_parts[-1],
                    bucket=bucket.name,
                    type='folder',
                    size='',
                    url='',
                    permission='public',
                    modified=s3_obj.last_modified,
                    key=subfolder,
                    folder=True,
                    is_owner=is_owner
                )
        if depth > max_depth:
            continue
        if key.endswith("/"):  # Folder
            continue
        url = presigned_url(s3_obj)
        yield S3Object(name=s3_obj.key.split("/")[-1], type='document', bucket=bucket.name, permission='public',
                       modified=s3_obj.last_modified, size=format_bytes(s3_obj.size), key=key, url=url, folder=False,
                       is_owner=is_owner)


def list_bucket_folder(user, prefix="", request=None):
    """
    Yield the contents - both files and subfolders - of the current folder.
    Do NOT yield contents of subfolders.
    """
    logger.debug("Listing seller S3 bucket objects.")
    is_owner = user == request.user
    bucket = user.company.bucket_object
    session = boto3.Session(settings.AWS_ACCESS_KEY, settings.AWS_SECRET_ACCESS_KEY)
    s3_client = session.client("s3")
    try:
        s3_client.head_bucket(Bucket=bucket.name)
        # If no exception was thrown, this bucket already exists and belongs to us
    except botocore.exceptions.ClientError:
        logger.warning("Bucket does not exist: {}", bucket.name)
        return []
    permission = 'public'
    if 'private' in prefix:
        permission = 'private'

    # S3's folder listing behavior is a little wonky - probably because in
    # the underlying key-value datastore, folders don't really exist.  S3
    # only returns folder objects for _empty_ folders.  If a folder contains
    # files, only the file objects are returned, no folder.
    subfolder_set = set([""])  # S3 folders under the current prefix
    filter_prefix = "%s/" % prefix
    prefix_len = len(os.path.dirname(filter_prefix).split("/"))
    max_depth = prefix_len + 1  # We only want objects from the current folder
    subfolder_depth = prefix_len + 1
    for s3_obj in bucket.objects.filter(Prefix=filter_prefix):
        key: str = s3_obj.key
        foldername = os.path.dirname(key)
        foldername_parts = foldername.split("/")
        subfolder_parts = foldername_parts[:subfolder_depth]
        subfolder = "/".join(subfolder_parts)
        key_parts = key.split("/")
        depth = len(key_parts)
        if subfolder not in subfolder_set:
            subfolder_set.add(subfolder)
            if filter_prefix == key[:-1]:
                continue
            if len(subfolder_parts) == subfolder_depth:
                yield S3Object(
                    name=subfolder_parts[-1],
                    bucket=bucket.name,
                    type='folder',
                    size='',
                    url='',
                    permission=permission,
                    modified=s3_obj.last_modified,
                    key=subfolder,
                    folder=True,
                    is_owner=is_owner
                )
        if depth > max_depth:
            continue
        if key.endswith("/"):  # Folder
            continue
        url = presigned_url(s3_obj)
        yield S3Object(name=s3_obj.key.split("/")[-1], type='document', bucket=bucket.name, permission=permission,
                       modified=s3_obj.last_modified, size=format_bytes(s3_obj.size), key=key, url=url, folder=False,
                       is_owner=is_owner)


def format_bytes(size):
    # 2**10 = 1024
    power = 2 ** 10
    n = 0
    power_labels = {0: '', 1: 'K', 2: 'M', 3: 'G', 4: 'T'}
    while size > power:
        size /= power
        n += 1
    return '%s%s' % (round(size, 2), power_labels[n] + 'b')


def file_upload(file_object, bucket_name, file_key):
    session = boto3.Session(settings.AWS_ACCESS_KEY, settings.AWS_SECRET_ACCESS_KEY)
    s3 = session.client("s3")
    s3.upload_fileobj(file_object, bucket_name, file_key)


def move_file(copy_source, destination_bucket, destination_key):
    session = boto3.Session(settings.AWS_ACCESS_KEY, settings.AWS_SECRET_ACCESS_KEY)
    s3 = session.resource('s3')
    s3.meta.client.copy(copy_source, destination_bucket, destination_key)
