# Generated by Django 2.1.3 on 2020-10-06 04:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0065_project'),
    ]

    operations = [
        migrations.AddField(
            model_name='experimententry',
            name='column',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='experimententry',
            name='row',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='experimententryversion',
            name='column',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='experimententryversion',
            name='row',
            field=models.IntegerField(null=True),
        ),
    ]