from django.core.management.base import BaseCommand
from django.core import management
from django.utils import timezone
from django.conf import settings
from django.db import connections
from django.db.utils import load_backend
from api_base.models import Database
import time

class Command(BaseCommand):
    help = 'Migrate to all company database'

    def handle(self, *args, **kwargs):
        databases = Database.objects.all()
        str_time = timezone.now().strftime('%X')
        self.stdout.write("%s: Start migrate for all databases" % str_time)
        for database in databases:
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
            management.call_command('migrate', '--database=%s' % db_name)
            str_time = timezone.now().strftime('%X')
            self.stdout.write("%s: Migrate success for %s" % (str_time, database.db_name))
            connections.close_all()
        self.stdout.write("\n%s: Finished migrate\n" % str_time)
