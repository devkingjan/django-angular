# Generated by Django 2.1.3 on 2020-08-24 17:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0032_calendarevent_user_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='calendarevent',
            name='members',
            field=models.ManyToManyField(to='api_company.Member'),
        ),
    ]