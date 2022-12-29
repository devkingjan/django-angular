from django.db import models
import jsonfield
from api_company.models import Member


class CalendarEvent(models.Model):
    start = models.DateTimeField(blank=True, null=True)
    end = models.DateTimeField(blank=True, null=True)
    title = models.CharField(max_length=400, blank=True, null=True)
    allDay = models.BooleanField(default=False)
    color = jsonfield.JSONField()
    resizable = jsonfield.JSONField()
    draggable = models.BooleanField(default=False)
    meta = jsonfield.JSONField()
    user_id = models.IntegerField(blank=True, null=True)
    members = models.ManyToManyField(to=Member, blank=True, null=True)

    class Meta:
        db_table = 'calendar_event'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.title)
