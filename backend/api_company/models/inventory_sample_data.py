from django.db import models
from api_company.models import InventorySample, InventoryColumn


class InventorySampleData(models.Model):

    value = models.CharField(max_length=400, blank=True, null=True)
    column = models.ForeignKey(InventoryColumn, on_delete=models.CASCADE)
    inventory_sample = models.ForeignKey(InventorySample, on_delete=models.CASCADE, related_name='sample_data')

    class Meta:
        db_table = 'inventory_sample_data'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.value)
