# Generated by Django 2.1.3 on 2020-10-12 12:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0071_auto_20201012_0931'),
    ]

    operations = [
        migrations.AddField(
            model_name='projecthistory',
            name='project',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api_company.Project'),
        ),
    ]
