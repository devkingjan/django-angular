from django.db import models
from api_company.models import Experiment, Column


class ExperimentData(models.Model):

    value = models.CharField(max_length=400, blank=True, null=True)
    column = models.ForeignKey(Column, on_delete=models.CASCADE)
    experiment = models.ForeignKey(Experiment, on_delete=models.CASCADE, related_name='exp_data')

    class Meta:
        db_table = 'experiment_data'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.value)
