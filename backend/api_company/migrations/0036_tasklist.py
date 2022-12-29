# Generated by Django 2.1.3 on 2020-09-03 05:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0035_auto_20200828_1943'),
    ]

    operations = [
        migrations.CreateModel(
            name='TaskList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=400, null=True)),
                ('user_id', models.CharField(blank=True, max_length=400, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'task_list',
            },
        ),
    ]
