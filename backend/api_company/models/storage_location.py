from django.db import models
from api_company.models import InventoryDatabase, StorageTemperature, StorageEquipment


class StorageLocation(models.Model):
    STORAGE_TYPE_BOX = 'box'
    STORAGE_TYPE_SHELF = 'shelf'

    STORAGE_TYPE_CHOICES = (
        (STORAGE_TYPE_BOX, 'box'),
        (STORAGE_TYPE_SHELF, 'shelf'),
    )
    DEFINE_LOCATION_RUNNING_NUMBERS = 'by_running_numbers'
    DEFINE_LOCATION_LETTER_NUMBER = 'by_letter_number'

    DEFINE_LOCATION_CHOICES = (
        (DEFINE_LOCATION_RUNNING_NUMBERS, 'By Running Number'),
        (DEFINE_LOCATION_LETTER_NUMBER, 'By Letter and Number')
    )

    database = models.ForeignKey(InventoryDatabase, on_delete=models.CASCADE)
    storage_temperature = models.ForeignKey(StorageTemperature, on_delete=models.CASCADE)
    equipment = models.ForeignKey(StorageEquipment, on_delete=models.CASCADE)
    allocate_tower = models.CharField(max_length=400, blank=True, null=True)
    storage_type = models.CharField(choices=STORAGE_TYPE_CHOICES, max_length=400, blank=True, null=True)
    allocate_number = models.CharField(max_length=400, blank=True, null=True)
    vertical_number = models.IntegerField(blank=True, null=True)
    horizontal_number = models.IntegerField(blank=True, null=True)
    define_location = models.CharField(choices=DEFINE_LOCATION_CHOICES, max_length=400, blank=True, null=True)

    class Meta:
        db_table = 'storage_location'
