from django.core.management.base import BaseCommand
from authentication.models import User
from api_company.models import Experiment
from api_base.models import Company
from django.conf import settings
from django.db import connections
from django.db.utils import load_backend
from loguru import logger


class Command(BaseCommand):
    help = 'Create all exp data folder for existing experiment'

    def handle(self, *args, **kwargs):
        companies = Company.objects.exclude(status=Company.STATUS_DELETED).all()
        for company in companies:
            self.access_to_company_db(company)
            logger.debug("Access to company {company} DB", company=company.email)
            users = User.objects.filter(company_uid=company.uid).all()

            for user in users:
                logger.debug("Selected User {user} under {company}", user=user.email, company=company.email)
                try:
                    self.initialize_exp_data_folder(user.company, user)
                except:
                    continue

    def access_to_company_db(self, company):
        database = company.database
        db_name = str(database.id)
        new_db = {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': database.db_name,
            'USER': database.user_name,
            'PASSWORD': database.password,
            'HOST': database.host_name,
            'PORT': 3306,  # Server Port
            'ATOMIC_REQUESTS': True,
        }
        settings.DATABASES[db_name] = new_db
        connections.ensure_defaults(db_name)
        connections.prepare_test_settings(db_name)
        db = connections.databases[db_name]
        backend = load_backend(db['ENGINE'])
        backend.DatabaseWrapper(db, db_name)
        settings.CURRENT_DB = db_name

    def initialize_exp_data_folder(self, company, user):
        """
        Creates a new overlay folder in the seller's S3 bucket
        """
        experiments = Experiment.objects.filter(user_id=user.id).exclude(status=Experiment.STATUS_CLOSE).all()
        for experiment in experiments:
            experiment.create_data_folder()
