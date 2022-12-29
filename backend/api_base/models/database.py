from django.db import models


class Database(models.Model):
    host_name = models.CharField(max_length=400, blank=True, null=True)
    db_name = models.CharField(max_length=400, blank=True, null=True)
    user_name = models.CharField(max_length=400, blank=True, null=True)
    password = models.CharField(max_length=400, blank=True, null=True)
    status = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'databases'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.db_name)
