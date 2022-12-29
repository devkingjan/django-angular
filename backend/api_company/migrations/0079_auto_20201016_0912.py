# Generated by Django 2.1.3 on 2020-10-16 09:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0078_auto_20201016_0829'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projecttaskevent',
            name='type',
            field=models.CharField(blank=True, choices=[('create_project', 'Create Project'), ('edit_project_title', 'Edit Project Title'), ('edit_project_member', 'Edit Project Member'), ('archive_project', 'Archived Project'), ('delete_project', 'Deleted Project'), ('create_task', 'Create Project Task'), ('edit_task', 'Edit Project Task'), ('edit_task_title', 'Edit Project Task Title'), ('edit_task_description', 'Edit Project Task Description'), ('edit_task_members', 'Edit Project Task Members'), ('edit_task_status', 'Edit Project Task Status'), ('edit_task_timeframe', 'Edit Project Task Timeframe'), ('add_comment', 'Edit Project Task Comment'), ('remove_task', 'Remove Project Task')], max_length=400, null=True),
        ),
    ]
