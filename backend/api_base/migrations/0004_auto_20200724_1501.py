# Generated by Django 2.1.3 on 2020-07-24 15:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api_base', '0003_auto_20200724_1101'),
    ]

    operations = [
        migrations.RenameField(
            model_name='company',
            old_name='name',
            new_name='institution',
        ),
    ]
