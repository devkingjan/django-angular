import datetime

from django.db import models
from api_company.models import Template
from authentication.models import User
from django.conf import settings
from loguru import logger
import boto3


class Experiment(models.Model):

    STATUS_OPEN = 0
    STATUS_CLOSE = 1
    STATUS_CHOICES = (
        (STATUS_OPEN, 'pending'),
        (STATUS_CLOSE, 'close'),
    )

    uid = models.CharField(max_length=400, blank=True, null=True)
    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    status = models.IntegerField(choices=STATUS_CHOICES, default=STATUS_OPEN)
    user_id = models.IntegerField(blank=True, null=True)
    sign_date = models.DateTimeField(null=True)
    signed_user = models.IntegerField(blank=True, null=True)
    assigned_user = models.IntegerField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'experiments'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.uid)

    def create_data_folder(self):
        user = User.objects.get(pk=self.user_id)
        if not user:
            return
        bucket = user.company.bucket_object
        folder_prefix = "%s/private/%s/%s" % (user.folder_name, settings.FOLDER_EXPERIMENT, self.uid)
        bucket.put_object(Key=folder_prefix + "/")
        logger.warning("Experiment Folder {folder} is created for user {user}", folder=self.uid, user=user.email)

    @property
    def data_folder_key(self):
        user = User.objects.get(pk=self.user_id)
        if not user:
            return
        folder_prefix = "%s/private/%s/%s" % (user.folder_name, settings.FOLDER_EXPERIMENT, self.uid)
        return folder_prefix

    @property
    def image_bucket_object(self):
        user = User.objects.get(pk=self.user_id)
        if not user:
            return
        bucket_name = user.company.bucket_name

        file_name = datetime.datetime.now().strftime('%Y_%m_%d_%H_%M_%S') + '.png'
        file_key = self.data_folder_key + '/' + file_name

        session = boto3.Session(settings.AWS_ACCESS_KEY, settings.AWS_SECRET_ACCESS_KEY)
        s3 = session.resource("s3")
        object = s3.Object(bucket_name, file_key)
        return object, file_key
