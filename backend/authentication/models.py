from django.contrib.auth.hashers import make_password, check_password, is_password_usable
from django.contrib.auth.models import AbstractUser, AbstractBaseUser
from django.db import models
import django
from api_base.models import Company
from django.conf import settings

from api_base.serializers import CompanySerializer
from datetime import datetime
import uuid


class User(AbstractUser):
    ROLE_IGOR_ADMIN = 2
    ROLE_COMPANY_ADMIN = 1
    ROLE_REGULAR_USER = 0

    ROLE_CHOICES = (
        (ROLE_IGOR_ADMIN, 'Igor Admin'),
        (ROLE_COMPANY_ADMIN, 'Company Admin'),
        (ROLE_REGULAR_USER, 'Regular User'),
    )

    COLOR_DEFAULT = 'theme-default'
    COLOR_BLIND = 'theme-yellow-light'
    COLOR_DARK = 'theme-blue-gray-dark'

    COLOR_CHOICES = (
        (COLOR_DEFAULT, 'theme-default'),
        (COLOR_BLIND, 'theme-yellow-light'),
        (COLOR_DARK, 'theme-blue-gray-dark')
    )

    first_name = models.CharField(max_length=400, null=True, blank=True)
    last_name = models.CharField(max_length=400, null=True, blank=True)
    role = models.CharField(max_length=400, null=True, blank=True)
    initials = models.CharField(max_length=400, null=True, blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=400)
    pwd_updated = models.DateField(default=django.utils.timezone.now)
    pin = models.CharField(max_length=255, blank=True)
    pin_updated = models.DateTimeField(auto_now_add=True, null=True)
    username = models.CharField(max_length=150, unique=True, blank=True)
    emergency_first_name = models.CharField(max_length=400, null=True, blank=True)
    emergency_last_name = models.CharField(max_length=400, null=True, blank=True)
    user_role = models.IntegerField(choices=ROLE_CHOICES, default=0)
    inviter = models.ForeignKey('self', blank=True, null=True, on_delete=models.CASCADE)
    color_mode = models.CharField(max_length=400, choices=COLOR_CHOICES, default=COLOR_DEFAULT, blank=True, null=True)
    company_uid = models.CharField(max_length=400, null=True, blank=True)
    telephone = models.CharField(max_length=400, null=True, blank=True)
    relation = models.CharField(max_length=400, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    avatar = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.email

    def set_pin(self, raw_pin):
        self.pin = make_password(raw_pin)
        self._pin = raw_pin

    def check_pin(self, raw_pin):
        """
        Return a boolean of whether the raw_pin was correct. Handles
        hashing formats behind the scenes.
        """
        def setter(raw_pin):
            self.set_pin(raw_pin)
            # PIN hash upgrades shouldn't be considered PIN changes.
            self._pin = None
            self.save(update_fields=["pin"])
        return check_password(raw_pin, self.pin, setter)

    def set_unusable_pin(self):
        # Set a value that will never be a valid hash
        self.pin = make_password(None)

    def has_usable_pin(self):
        """
        Return False if set_unusable_pin() has been called for this user.
        """
        return is_password_usable(self.pin)

    @property
    def company(self):
        company = Company.objects.get(uid=self.company_uid)
        return company

    @property
    def folder_name(self) -> str:
        """
        Name of the S3 bucket where this brand can upload images
        """
        # Slugs cannot contain underscores
        return "folder-{slug}".format(slug=self.username)
