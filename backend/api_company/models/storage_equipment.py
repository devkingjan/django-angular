from django.db import models


class StorageEquipment(models.Model):

    name = models.CharField(max_length=400, blank=True, null=True)
    is_tower = models.BooleanField(default=False)
    tower_number = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'storage_equipment'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.name)
