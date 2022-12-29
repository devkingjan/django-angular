import uuid
import boto3
from loguru import logger
from django.db import models
from api_base.models import Company


class Member(models.Model):
    STATUS_PENDING = 0
    STATUS_SEND_INVITATION = 1
    STATUS_ACCEPT_INVITATION = 2
    STATUS_DELETED = 3
    STATUS_CHOICES = (
        (STATUS_PENDING, 'pending'),
        (STATUS_SEND_INVITATION, 'sent invitation'),
        (STATUS_ACCEPT_INVITATION, 'accept invitation'),
        (STATUS_DELETED, 'deleted user'),
    )

    first_name = models.CharField(max_length=400, blank=True, null=True)
    last_name = models.CharField(max_length=400, blank=True, null=True)
    role = models.CharField(max_length=400, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=STATUS_PENDING)
    uid = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    company_uid = models.UUIDField(unique=True, default=None, blank=True, null=True, verbose_name="company")
    avatar = models.CharField(max_length=400, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'members'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.email)
