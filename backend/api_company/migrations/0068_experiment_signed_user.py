# Generated by Django 2.1.3 on 2020-10-07 02:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0067_projecttask'),
    ]

    operations = [
        migrations.AddField(
            model_name='experiment',
            name='signed_user',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
