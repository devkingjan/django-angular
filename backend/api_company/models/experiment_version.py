from django.db import models

from api_company.models import Experiment


class ExperimentVersion(models.Model):
    experiment = models.ForeignKey(Experiment, on_delete=models.CASCADE, null=True)
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'experiment_version'
