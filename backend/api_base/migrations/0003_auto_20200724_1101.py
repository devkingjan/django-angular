# Generated by Django 2.1.3 on 2020-07-24 11:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_base', '0002_auto_20200724_1059'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]