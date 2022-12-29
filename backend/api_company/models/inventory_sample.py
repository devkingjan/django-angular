from django.db import models
from api_company.models import InventoryDatabase


class InventorySample(models.Model):

    STATUS_OPEN = 0
    STATUS_CLOSE = 1
    STATUS_CHOICES = (
        (STATUS_OPEN, 'pending'),
        (STATUS_CLOSE, 'close'),
    )

    uid = models.CharField(max_length=400, blank=True, null=True)
    database = models.ForeignKey(InventoryDatabase, on_delete=models.CASCADE)
    status = models.IntegerField(choices=STATUS_CHOICES, default=STATUS_OPEN)
    user_id = models.IntegerField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'inventory_samples'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.uid)
