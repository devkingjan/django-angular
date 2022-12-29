import urllib3
from loguru import logger
from rest_framework.views import APIView
from rest_framework.response import Response
from authentication.models import User
from api_company.serializers import BucketSerializer
from ctrl.s3 import S3Object, list_bucket_folder, list_user_folder, presigned_url, format_bytes
from rest_framework import viewsets, status
from rest_framework.decorators import action
from django.urls import reverse


class GetFileView(APIView):

    def get(self, request):
        user_id = self.request.query_params['user']
        user = User.objects.get(pk=user_id)
        serializer = BucketSerializer(
            list_user_folder(user=user, request=request), many=True,
        )
        file_list = serializer.data
        file_list = sorted(file_list, key=lambda i: i['folder'], reverse=True   )
        return Response(file_list)


class UserFileViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = BucketSerializer

    @action(detail=True, url_path="bucket/(?P<folder_prefix>.*)")
    def folder(self, request, pk, folder_prefix):
        """
        Get the contents of a subfolder in the seller's S3 bucket
        """
        user = self.get_object()
        if 'private' == folder_prefix.split('/')[1] and user.id != self.request.user.id:
            return Response(data={'detail': 'No permission to access private storage'}, status=status.HTTP_403_FORBIDDEN)
        serializer = BucketSerializer(
            list_bucket_folder(user=user, prefix=folder_prefix, request=request), many=True
        )
        file_list = serializer.data
        file_list = sorted(file_list, key=lambda i: i['folder'], reverse=True)
        return Response(file_list)

    @action(
        detail=True, url_path="upload/(?P<folder_prefix>.*)", methods=["post"]
    )
    def upload(self, request, pk, folder_prefix):
        """
        Uploads media(image) to s3.
        :param: Form data(file)
        :return: S3Object
        """
        user = self.get_object()
        is_owner = user == self.request.user
        permission = 'public'
        if 'private' in folder_prefix:
            permission = 'private'
        filename = request.FILES["file"]
        bucket = user.company.bucket_object
        if folder_prefix == "public":
            folder_prefix = "%s/%s" % (user.folder_name, folder_prefix)
        s3_key = f"{folder_prefix}/{filename}"
        raw_image = request.FILES["file"].read()
        try:
            obj = bucket.put_object(Key=s3_key, Body=raw_image)
            url = presigned_url(obj)
            s3_obj = S3Object(
                name=obj.key.split("/")[-1],
                type='document',
                bucket=bucket.name,
                permission=permission,
                modified=obj.last_modified,
                size=format_bytes(filename.size),
                key=obj.key,
                url=url,
                folder=False,
                is_owner=is_owner
            )
            serializer = BucketSerializer(s3_obj, many=False)
            return Response(serializer.data)

        except urllib3.exceptions.ReadTimeoutError:
            logger.error("Timeout transferring asset from external host to S3")
            raise

    @action(
        detail=True, url_path="add-folder/(?P<folder_prefix>.*)", methods=["post"]
    )
    def add_folder(self, request, pk, folder_prefix):
        """
        add folder to file manager
        """
        user = self.get_object()
        is_owner = user == self.request.user
        bucket = user.company.bucket_object
        folder_name = self.request.data['name']
        permission = 'public'
        if 'private' in folder_prefix:
            permission = 'private'
        folder_prefix = "%s/%s" % (folder_prefix, folder_name)

        try:
            obj = bucket.put_object(Key=folder_prefix + "/")
            s3_obj = S3Object(
                name=folder_name,
                bucket=bucket.name,
                type='folder',
                size='',
                url='',
                permission=permission,
                modified=obj.last_modified,
                key=obj.key,
                folder=True,
                is_owner=is_owner
            )
            serializer = BucketSerializer(s3_obj, many=False)
            return Response(serializer.data)

        except urllib3.exceptions.ReadTimeoutError:
            logger.error("Timeout transfering asset from external host to S3")
            raise

    @action(detail=True, name="delete-key", url_path="delete-key", methods=["post"])
    def delete_media(self, request, pk, format=None):
        """
        Delete objects which has full key(images)
        Delete all objects which has specific prefix(folders)
        :param {
            selected_keys: (array)      list of key
            selected_folders: (array)   list of prefix
        }
        :return Success
        """
        user = self.get_object()
        bucket = user.company.bucket_object
        key = self.request.data["key"]
        folder = self.request.data["folder"]
        if folder:
            s3_prefix = "%s/" % key
            for s3_obj in bucket.objects.filter(Prefix=s3_prefix).all():
                s3_obj.delete()
        else:
            bucket.delete_objects(Delete={"Objects": [{'Key': key}]})

        return Response()

    @action(detail=True, name="delete-key", url_path="update-permission", methods=["post"])
    def update_permission(self, request, pk, format=None):
        """
        update permission
        :return Success
        """
        user = self.get_object()
        bucket = user.company.bucket_object
        old_obj = self.request.data

        key = old_obj["key"]
        folder = old_obj["folder"]
        permission = old_obj["permission"]

        old_key = key
        if permission == 'public':
            new_key = old_key.replace('public', 'private')
            new_permission = 'private'
        else:
            new_key = old_key.replace('private', 'public')
            new_permission = 'public'

        if folder:
            new_obj = self.rename_folder(old_key, new_key, bucket, old_obj, new_permission)
        else:
            new_obj = self.rename_key(old_key, new_key, bucket, old_obj, new_permission)

        return Response(new_obj)

    def rename_folder(self, old_key, new_key, bucket, old_obj, new_permission):
        """
        Rename folder and update s3_key in related asset & overlay
        :param old_key:
        :param new_key:
        :param pk:
        :param request:
        :return:
        """
        old_prefix = "%s/" % old_key
        new_prefix = "%s/" % new_key
        for obj in bucket.objects.filter(Prefix=old_prefix):
            key: str = obj.key
            old_source = {"Bucket": bucket.name, "Key": key}
            # replace the prefix
            replace_key = key.replace(old_prefix, new_prefix, 1)
            new_obj = bucket.Object(replace_key)
            new_obj.copy(old_source)
        # delete old s3 obj
        bucket.objects.filter(Prefix=old_prefix).delete()
        # create new S3Object for response
        s3_obj = S3Object(
            name=old_obj['name'],
            bucket=bucket.name,
            type='folder',
            size='',
            url='',
            permission=new_permission,
            modified=obj.last_modified,
            key=obj.key,
            folder=True,
            is_owner=old_obj['is_owner']
        )
        serializer = BucketSerializer(s3_obj, many=False)
        return serializer.data

    def rename_key(self, old_key, new_key, bucket, old_obj, permission):
        """
        Rename s3 key and update s3_key in related asset & overlay
        :param old_key:
        :param new_key:
        :return:
        """
        copy_source = {"Bucket": bucket.name, "Key": old_key}
        bucket.meta.client.copy(copy_source, bucket.name, new_key)
        bucket.delete_objects(Delete={"Objects": [{"Key": old_key}]})
        obj = bucket.Object(new_key)
        url = presigned_url(obj)

        # create new S3Object for response
        s3_obj = S3Object(name=old_obj['name'], type='document', bucket=bucket.name, permission=permission,
                 modified=obj.last_modified, size=old_obj['size'], key=new_key, url=url, folder=False,
                 is_owner=old_obj['is_owner'])
        serializer = BucketSerializer(s3_obj, many=False)
        return serializer.data
