# Generated by Django 2.1.3 on 2020-09-04 03:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0037_task'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='due_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]