# Generated by Django 2.1.3 on 2020-08-08 08:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0019_auto_20200808_0401'),
    ]

    operations = [
        migrations.AddField(
            model_name='storagelocation',
            name='allocate_tower',
            field=models.CharField(blank=True, max_length=400, null=True),
        ),
    ]