# Generated by Django 2.1.3 on 2020-10-14 12:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0015_auto_20200901_1801'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='pin',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='user',
            name='pin_updated',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
