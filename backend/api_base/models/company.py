import uuid
import boto3
import botocore.client
from loguru import logger
from django.db import models
from api_base.models import Database
from django.conf import settings


class Company(models.Model):
    STATUS_PENDING = 0
    STATUS_SEND_INVITATION = 1
    STATUS_ACCEPT_INVITATION = 2
    STATUS_DELETED = 3
    STATUS_CHOICES = (
        (STATUS_PENDING, 'pending'),
        (STATUS_SEND_INVITATION, 'sent invitation'),
        (STATUS_ACCEPT_INVITATION, 'accept invitation'),
        (STATUS_DELETED, 'deleted account'),
    )
    institution = models.CharField(max_length=400, blank=True, null=True)
    first_name = models.CharField(max_length=400, blank=True, null=True)
    last_name = models.CharField(max_length=400, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    db_name = models.CharField(max_length=400, blank=True, null=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=STATUS_PENDING)
    uid = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    database = models.ForeignKey(Database, on_delete=models.CASCADE, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'companies'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.email)

    @property
    def bucket_name(self) -> str:
        """
        Name of the S3 bucket where this brand can upload images
        """
        # Slugs cannot contain underscores
        sanitized_slug = self.db_name.replace("_", "-")
        return "{server}-{prefix}-{slug}".format(server=settings.SERVER_ENV,
                                                 prefix=settings.S3_BUCKET_PREFIX, slug=sanitized_slug.lower()
                                                 )

    @property
    def bucket_object(self):
        """
        :return: Boto3 S3 Bucket object for this brand
        """
        session = boto3.Session(settings.AWS_ACCESS_KEY, settings.AWS_SECRET_ACCESS_KEY)
        s3 = session.resource("s3")
        bucket = s3.Bucket(self.bucket_name)
        return bucket

    def initialize_bucket(self) -> None:
        """
        Creates a new S3 bucket for this brand
        """
        logger.debug("Initializing S3 bucket for {}", self)
        bucket = self.bucket_name
        session = boto3.Session(settings.AWS_ACCESS_KEY, settings.AWS_SECRET_ACCESS_KEY)
        s3 = session.client("s3", region_name=settings.AWS_REGION)
        conf = {"LocationConstraint": settings.AWS_REGION}
        # Check if bucket already exists
        try:
            s3.head_bucket(Bucket=bucket)
            # If no exception was thrown, this bucket already exists and belongs to us
            logger.debug('Found existing bucket "{}"', bucket)
            return None
        except botocore.exceptions.ClientError as e:
            # If we got an exception here, bucket does not exist and belong to us
            pass
        try:
            s3.create_bucket(Bucket=bucket, CreateBucketConfiguration=conf)
            logger.info(
                'Created S3 bucket "{bucket}" for "{company}"', bucket=bucket, company=self,
            )
        except botocore.exceptions.ClientError:
            logger.exception("Error creating S3 bucket for {brand}", brand=self)
            raise
