# Generated by Django 2.1.3 on 2020-08-18 08:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0029_inventorydropdown_value1'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='inventorydropdown',
            name='value1',
        ),
    ]
