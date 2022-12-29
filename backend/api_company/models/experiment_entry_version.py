from django.db import models

from api_company.choices import ExperimentEntryTypeChoices
from api_company.models.experiment_version import ExperimentVersion


class ExperimentEntryVersion(models.Model):
    experiment_version = models.ForeignKey(ExperimentVersion, on_delete=models.CASCADE, null=True)
    data = models.TextField(blank=True)
    type = models.CharField(
        choices=ExperimentEntryTypeChoices.choices(),
        max_length=10
    )
    column = models.IntegerField(null=True)
    row = models.IntegerField(null=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'experiment_entry_version'
