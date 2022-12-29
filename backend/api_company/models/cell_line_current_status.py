import copy
from django.db import models
from api_company.models import CellCultureLine, CellLineRow


class CellLineCurrentStatus(models.Model):

    uid = models.CharField(max_length=400, blank=True, null=True)
    name = models.CharField(max_length=400, blank=True, null=True)
    origin = models.CharField(max_length=400, blank=True, null=True)
    generic_modification = models.CharField(max_length=400, blank=True, null=True)
    how_started = models.CharField(max_length=400, blank=True, null=True)
    received_scientist = models.CharField(max_length=400, blank=True, null=True)
    cloned_cell_line = models.IntegerField(blank=True, null=True)
    date_taken = models.DateTimeField(blank=True, null=True)
    passage_number = models.IntegerField(blank=True, null=True)
    culture_medium = models.CharField(max_length=400, blank=True, null=True)
    medium_additive = models.CharField(max_length=400, blank=True, null=True)
    mycoplasmas_state = models.CharField(max_length=400, blank=True, null=True)
    mycoplasmas_date = models.DateTimeField(null=True, blank=True)
    culture_property = models.CharField(max_length=400, blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    user_id = models.IntegerField(blank=True, null=True)
    removed = models.BooleanField(default=False)
    ended_at = models.DateTimeField(null=True, blank=True)
    cell_line = models.ForeignKey(CellCultureLine, null=True, blank=True, on_delete=models.CASCADE, related_name='current_status')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cell_line_current_status'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.name)

