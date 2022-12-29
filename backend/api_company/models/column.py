from django.db import models
from api_company.models import Template


class Column(models.Model):
    WIDGET_TEXT = 'text'
    WIDGET_NUMBER = 'number'
    WIDGET_DATE = 'date'
    WIDGET_DROPDOWN = 'dropdown'

    WIDGET_CHOICES = (
        (WIDGET_TEXT, 'text'),
        (WIDGET_NUMBER, 'number'),
        (WIDGET_DATE, 'date'),
        (WIDGET_DROPDOWN, 'dropdown'),
    )

    name = models.CharField(max_length=400, blank=True, null=True)
    widget = models.CharField(choices=WIDGET_CHOICES, max_length=400, blank=True, null=True)
    order = models.IntegerField(default=0)
    default = models.BooleanField(default=False)
    template = models.ForeignKey(Template, on_delete=models.CASCADE)

    class Meta:
        db_table = 'columns'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.name)
