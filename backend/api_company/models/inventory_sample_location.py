from django.db import models
from api_company.models import InventorySample, StorageLocation


class InventorySampleLocation(models.Model):

    sample = models.ForeignKey(InventorySample, on_delete=models.CASCADE, related_name='location')
    location = models.ForeignKey(StorageLocation, on_delete=models.CASCADE)
    position = models.CharField(max_length=400, blank=True, null=True)

    class Meta:
        db_table = 'inventory_sample_location'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.position)
