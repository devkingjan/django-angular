# Generated by Django 2.1.3 on 2020-10-08 15:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0068_experiment_signed_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectTaskComment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.TextField(blank=True, null=True)),
                ('user_id', models.IntegerField(blank=True, null=True)),
                ('task', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='api_company.Task')),
            ],
            options={
                'db_table': 'project_task_comment',
            },
        ),
        migrations.AddField(
            model_name='project',
            name='status',
            field=models.CharField(blank=True, choices=[('active', 'Active'), ('archived', 'Archived')], max_length=400, null=True),
        ),
        migrations.AddField(
            model_name='projecttask',
            name='order',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='projecttask',
            name='user_id',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
