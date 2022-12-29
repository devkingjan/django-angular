from django.db import models
from django.utils import timezone
from api_company.models import ProjectTask, Project, ProjectHistory, ProjectTaskHistory


class ProjectTaskEvent(models.Model):
    TYPE_CREATE_PROJECT = 'create_project'
    TYPE_EDIT_PROJECT_TITLE = 'edit_project_title'
    TYPE_EDIT_PROJECT_MEMBER = 'edit_project_member'
    TYPE_ARCHIVE_PROJECT = 'archive_project'
    TYPE_RE_ACTIVE_PROJECT = 're_active_project'
    TYPE_DELETE_PROJECT = 'delete_project'
    TYPE_CREATE_TASK = 'create_task'
    TYPE_EDIT_TASK = 'edit_task'
    TYPE_EDIT_TASK_TITLE = 'edit_task_title'
    TYPE_EDIT_TASK_DESCRIPTION = 'edit_task_description'
    TYPE_EDIT_TASK_MEMBERS = 'edit_task_members'
    TYPE_EDIT_TASK_STATUS = 'edit_task_status'
    TYPE_EDIT_TASK_TIMEFRAME = 'edit_task_timeframe'
    TYPE_ADD_COMMENT = 'add_comment'
    TYPE_REMOVE_TASK = 'remove_task'

    TYPE_CHOICES = (
        (TYPE_CREATE_PROJECT, 'Create Project'),
        (TYPE_EDIT_PROJECT_TITLE, 'Edit Project Title'),
        (TYPE_EDIT_PROJECT_MEMBER, 'Edit Project Member'),
        (TYPE_ARCHIVE_PROJECT, 'Archived Project'),
        (TYPE_DELETE_PROJECT, 'Deleted Project'),
        (TYPE_CREATE_TASK, 'Create Project Task'),
        (TYPE_EDIT_TASK, 'Edit Project Task'),
        (TYPE_EDIT_TASK_TITLE, 'Edit Project Task Title'),
        (TYPE_EDIT_TASK_DESCRIPTION, 'Edit Project Task Description'),
        (TYPE_EDIT_TASK_MEMBERS, 'Edit Project Task Members'),
        (TYPE_EDIT_TASK_STATUS, 'Edit Project Task Status'),
        (TYPE_EDIT_TASK_TIMEFRAME, 'Edit Project Task Timeframe'),
        (TYPE_ADD_COMMENT, 'Edit Project Task Comment'),
        (TYPE_REMOVE_TASK, 'Remove Project Task'),
    )

    comment = models.TextField(blank=True, null=True)
    user_id = models.IntegerField(blank=True, null=True)
    first_name = models.CharField(max_length=400, null=True, blank=True)
    last_name = models.CharField(max_length=400, null=True, blank=True)
    type = models.CharField(max_length=400, choices=TYPE_CHOICES, null=True, blank=True)
    project = models.ForeignKey(Project, null=True, blank=True, related_name='project', on_delete=models.CASCADE)
    task = models.ForeignKey(ProjectTask, null=True, blank=True, related_name='task', on_delete=models.CASCADE)
    after_project = models.ForeignKey(ProjectHistory, null=True, blank=True, related_name='after_project',
                                      on_delete=models.CASCADE)
    after_task = models.ForeignKey(ProjectTaskHistory, null=True, blank=True, related_name='after_task',
                                   on_delete=models.CASCADE)
    before_project = models.ForeignKey(ProjectHistory, null=True, blank=True, related_name='before_project',
                                      on_delete=models.CASCADE)
    before_task = models.ForeignKey(ProjectTaskHistory, null=True, blank=True, related_name='before_task',
                                   on_delete=models.CASCADE)
    description = models.CharField(max_length=400, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'project_task_event'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.comment)
