from django.db import models
from api_company.models import Column


class ExperimentDropdown(models.Model):

    value = models.CharField(max_length=400, blank=True, null=True)
    column = models.ForeignKey(Column, on_delete=models.CASCADE)

    class Meta:
        db_table = 'experiment_dropdown'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.value)
