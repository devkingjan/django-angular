from django.db import models


class InventoryDatabase(models.Model):

    name = models.CharField(max_length=400, blank=True, null=True)

    class Meta:
        db_table = 'inventory_database'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.name)
