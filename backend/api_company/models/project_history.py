from django.db import models
from api_company.models import Member, Project


class ProjectHistory(models.Model):
    STATUS_ACTIVE = 'active'
    STATUS_ARCHIVED = 'archived'
    STATUS_CHOICE = (
        (STATUS_ACTIVE, 'Active'),
        (STATUS_ARCHIVED, 'Archived'),
    )
    name = models.CharField(max_length=400, blank=True, null=True)
    project = models.ForeignKey(Project, null=True, blank=True, on_delete=models.CASCADE)
    user_id = models.IntegerField(blank=True, null=True)
    members = models.ManyToManyField(Member)
    status = models.CharField(choices=STATUS_CHOICE, max_length=400, blank=True, null=True)

    class Meta:
        db_table = 'project_history'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.name)
