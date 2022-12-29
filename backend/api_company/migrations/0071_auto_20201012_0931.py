# Generated by Django 2.1.3 on 2020-10-12 09:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0070_auto_20201012_0914'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=400, null=True)),
                ('user_id', models.IntegerField(blank=True, null=True)),
                ('status', models.CharField(blank=True, choices=[('active', 'Active'), ('archived', 'Archived')], max_length=400, null=True)),
                ('members', models.ManyToManyField(to='api_company.Member')),
            ],
            options={
                'db_table': 'project_history',
            },
        ),
        migrations.CreateModel(
            name='ProjectTaskEvent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.TextField(blank=True, null=True)),
                ('user_id', models.IntegerField(blank=True, null=True)),
                ('type', models.CharField(blank=True, choices=[('create_project', 'Create Project'), ('edit_project', 'Edit Project'), ('archive_project', 'Archived Project'), ('delete_project', 'Deleted Project'), ('create_task', 'Create Project Task'), ('edit_task', 'Edit Project Task'), ('edit_task_title', 'Edit Project Task Title'), ('edit_task_members', 'Edit Project Task Members'), ('edit_task_status', 'Edit Project Task Status'), ('edit_task_timeframe', 'Edit Project Task Timeframe'), ('add_comment', 'Edit Project Task Comment'), ('remove_task', 'Remove Project Task')], max_length=400, null=True)),
                ('description', models.CharField(blank=True, max_length=400, null=True)),
                ('project', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='project', to='api_company.Project')),
                ('project_history', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='project_history', to='api_company.ProjectHistory')),
                ('task', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='task', to='api_company.ProjectTask')),
            ],
            options={
                'db_table': 'project_task_event',
            },
        ),
        migrations.CreateModel(
            name='ProjectTaskHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateTimeField(blank=True, null=True)),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('title', models.CharField(blank=True, max_length=400, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('user_id', models.IntegerField(blank=True, null=True)),
                ('status', models.CharField(blank=True, choices=[('done', 'Done'), ('in_progress', 'In Progress'), ('in_planing', 'In Planing'), ('on_hold', 'On Hold')], max_length=400, null=True)),
                ('order', models.IntegerField(blank=True, null=True)),
                ('members', models.ManyToManyField(to='api_company.Member')),
                ('project', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='history_tasks', to='api_company.Project')),
            ],
            options={
                'db_table': 'project_task_history',
            },
        ),
        migrations.AddField(
            model_name='projecttaskevent',
            name='task_history',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='task_history', to='api_company.ProjectTaskHistory'),
        ),
    ]