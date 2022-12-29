from django.db import models

from api_company.choices import ExperimentEntryTypeChoices
from api_company.models import Experiment


class ExperimentEntry(models.Model):
    experiment = models.ForeignKey(Experiment, on_delete=models.CASCADE, null=True)
    data = models.TextField(blank=True)
    type = models.CharField(
        choices=ExperimentEntryTypeChoices.choices(),
        max_length=10
    )
    order = models.IntegerField(default=0)
    column = models.IntegerField(null=True)
    row = models.IntegerField(null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'experiment_entry'
