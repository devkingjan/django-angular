from django.db import models


class TaskList(models.Model):

    name = models.CharField(max_length=400, blank=True, null=True)
    user_id = models.CharField(max_length=400, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'task_list'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.name)
