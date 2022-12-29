from django.db import models
from api_company.models import TaskList


class Task(models.Model):

    name = models.CharField(max_length=400, blank=True, null=True)
    task_list = models.ForeignKey(TaskList, blank=True, null=True, on_delete=models.CASCADE)
    due_date = models.DateField(blank=True, null=True)
    user_id = models.CharField(max_length=400, blank=True, null=True)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'task'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.name)
