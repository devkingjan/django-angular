# Generated by Django 2.1.3 on 2020-07-31 08:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0008_auto_20200731_0825'),
    ]

    operations = [
        migrations.CreateModel(
            name='Experiment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=400, null=True)),
                ('status', models.IntegerField(choices=[(0, 'pending'), (1, 'sent invitation')], default=0)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('template', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_company.Template')),
            ],
            options={
                'db_table': 'experiments',
            },
        ),
        migrations.CreateModel(
            name='ExperimentData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=400, null=True)),
                ('column', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_company.Column')),
                ('experiment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_company.Experiment')),
            ],
            options={
                'db_table': 'experiment_data',
            },
        ),
    ]
