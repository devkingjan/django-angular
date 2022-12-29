from django.db import models


class CellCultureOption(models.Model):

    name = models.CharField(max_length=400, blank=True, null=True)
    field = models.CharField(max_length=400, blank=True, null=True)
    user_id = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'cell_culture_option'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.name)
