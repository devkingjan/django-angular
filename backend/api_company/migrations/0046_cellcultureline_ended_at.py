# Generated by Django 2.1.3 on 2020-09-24 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0045_cellculturehistory'),
    ]

    operations = [
        migrations.AddField(
            model_name='cellcultureline',
            name='ended_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]