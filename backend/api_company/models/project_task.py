from django.db import models
from api_company.models import Project, Member


class ProjectTask(models.Model):
    STATUS_DONE = 'done'
    STATUS_IN_PROGRESS = 'in_progress'
    STATUS_IN_PLANING = 'in_planing'
    STATUS_ON_HOLD = 'on_hold'
    STATUS_DELETED = 'deleted'

    STATUS_CHOICES = (
        (STATUS_DONE, 'Done'),
        (STATUS_IN_PROGRESS, 'In Progress'),
        (STATUS_IN_PLANING, 'In Planing'),
        (STATUS_ON_HOLD, 'On Hold'),
        (STATUS_DELETED, 'Deleted'),
    )

    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    title = models.CharField(max_length=400, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    user_id = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=400, choices=STATUS_CHOICES, null=True, blank=True)
    project = models.ForeignKey(Project, null=True, blank=True, related_name='tasks', on_delete=models.CASCADE)
    members = models.ManyToManyField(Member)
    order = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'project_task'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.title)
