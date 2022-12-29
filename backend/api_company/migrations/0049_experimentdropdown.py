# Generated by Django 2.1.3 on 2020-09-26 15:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0048_auto_20200925_0751'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExperimentDropdown',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(blank=True, max_length=400, null=True)),
                ('column', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_company.Column')),
            ],
            options={
                'db_table': 'experiment_dropdown',
            },
        ),
    ]
