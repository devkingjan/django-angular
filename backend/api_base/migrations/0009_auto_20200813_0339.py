# Generated by Django 2.1.3 on 2020-08-13 03:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api_base', '0008_remove_database_company'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='database',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api_base.Database'),
        ),
        migrations.AddField(
            model_name='database',
            name='status',
            field=models.BooleanField(default=False),
        ),
    ]
