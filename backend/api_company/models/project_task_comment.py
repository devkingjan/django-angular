from django.db import models
from api_company.models import ProjectTask


class ProjectTaskComment(models.Model):

    comment = models.TextField(blank=True, null=True)
    user_id = models.IntegerField(blank=True, null=True)
    task = models.ForeignKey(ProjectTask, null=True, blank=True, related_name='comments', on_delete=models.CASCADE)

    class Meta:
        db_table = 'project_task_comment'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.comment)
