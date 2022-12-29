from django.db import models
from api_company.models import CellCultureLine, CellCultureEvent, CellLineRow


class CellStatusHistory(models.Model):
    LOG_TYPE_UPDATE_DATE = 0
    LOG_TYPE_ADD_NEW = 1
    LOG_TYPE_EVENT = 2
    LOG_TYPE_UPDATE_LINE = 3
    LOG_TYPE_REMOVE = 4

    CHOICE_LOG_TYPE = (
        (LOG_TYPE_UPDATE_DATE, 'Updated Date'),
        (LOG_TYPE_ADD_NEW, 'Added New Cell Line'),
        (LOG_TYPE_EVENT, 'Added Event'),
        (LOG_TYPE_UPDATE_LINE, 'Updated Cell Line'),
        (LOG_TYPE_REMOVE, 'Remove history'),
    )
    cell_event = models.ForeignKey(CellCultureEvent, null=True, blank=True, on_delete=models.CASCADE)
    cell_line = models.ForeignKey(CellCultureLine, null=True, blank=True, on_delete=models.CASCADE)
    cell_line_row = models.ForeignKey(CellLineRow, null=True, blank=True, on_delete=models.CASCADE)
    log_type = models.CharField(choices=CHOICE_LOG_TYPE, max_length=400, blank=True, null=True)
    removed = models.BooleanField(default=False)
    latest = models.BooleanField(default=False)
    ui_event_datetime = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'cell_status_history'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.name)




