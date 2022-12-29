from django.core.management.base import BaseCommand
from django.conf import settings
import boto3
from authentication.models import User
from loguru import logger


class Command(BaseCommand):
    help = 'Migrate to all company database'

    def handle(self, *args, **kwargs):
        company_users = User.objects.filter(user_role=User.ROLE_COMPANY_ADMIN).all()

        for company_user in company_users:
            company_user.company.initialize_bucket()
            bucket = company_user.company.bucket_name
            self.create_s3_folder(bucket, 'share/%s' % settings.FOLDER_PROTOCOL)
            self.create_s3_folder(bucket, 'share/%s' % settings.FOLDER_TEMPLATE)
            self.create_s3_folder(bucket, 'share/%s' % settings.FOLDER_BUFFER)

            self.initialize_member_default_folder(company_user.company, company_user)

        users = User.objects.filter(user_role=User.ROLE_REGULAR_USER).all()
        for user in users:
            try:
                self.initialize_member_default_folder(user.company, user)
            except:
                continue

    def initialize_member_default_folder(self, company, user):
        """
        Creates a new overlay folder in the seller's S3 bucket
        """
        bucket = company.bucket_name
        self.create_s3_folder(bucket, '%s' % user.folder_name)
        self.create_s3_folder(bucket, '%s/public' % user.folder_name)
        self.create_s3_folder(bucket, '%s/private' % user.folder_name)
        self.create_s3_folder(bucket, '%s/private/%s' % (user.folder_name, settings.FOLDER_EXPERIMENT))


    def create_s3_folder(self, bucket, name):
        session = boto3.Session(settings.AWS_ACCESS_KEY, settings.AWS_SECRET_ACCESS_KEY)
        s3 = session.client("s3")
        try:
            s3.get_object(Bucket=bucket, Key="%s/" % name)
            logger.debug(
                'Found existing folder {folder}/ in bucket "{bucket}"', folder=name, bucket=bucket,
            )
        except s3.exceptions.NoSuchKey:
            s3.put_object(Bucket=bucket, Key="%s/" % name)
            logger.debug(
                'Created new folder {folder}/ in bucket "{bucket}"', folder=name, bucket=bucket,
            )
