from django.db import models
from api_company.models import CellCultureLine


class CellCultureEvent(models.Model):
    LOG_TYPE_PASSAGE = 'log_passage'
    LOG_TYPE_MEDIUM_CHANGE = 'log_medium_change'
    LOG_TYPE_REMOVE_CELL_LINE = 'remove_cell_line'
    LOG_TYPE_ADD_NOTE = 'add_note'
    LOG_TYPE_MYCOPLASMA_TEST = 'log_mycoplasma_test'
    LOG_TYPE_ADD_MEDIUM_ADDITIVE = 'add_culture_medium_additive'

    CHOICE_LOG_TYPE = (
        (LOG_TYPE_PASSAGE, 'Log Passage'),
        (LOG_TYPE_MEDIUM_CHANGE, 'Medium Change'),
        (LOG_TYPE_REMOVE_CELL_LINE, 'Remove Cell Line'),
        (LOG_TYPE_ADD_NOTE, 'Add Note'),
        (LOG_TYPE_MYCOPLASMA_TEST, 'Mycoplasma Test'),
        (LOG_TYPE_ADD_MEDIUM_ADDITIVE, 'Add Culture Medium Additive'),
    )

    REMOVE_REASON_NO_NEEDED = 'no_longer_needed'
    REMOVE_REASON_CONTAMINATED = 'contaminated'
    REMOVE_REASON_DIED = 'died'
    REMOVE_REASON_FROZEN_DOWN = 'frozen_down'
    REMOVE_REASON_ALL_USED = 'all_used'
    REMOVE_REASON_OTHER = 'other'

    CHOICE_REASON = (
        (REMOVE_REASON_NO_NEEDED, 'No Longer Needed'),
        (REMOVE_REASON_CONTAMINATED, 'Contaminated'),
        (REMOVE_REASON_DIED, 'Died'),
        (REMOVE_REASON_FROZEN_DOWN, 'Frozen Down'),
        (REMOVE_REASON_ALL_USED, 'All Used'),
        (REMOVE_REASON_OTHER, 'Other'),
    )

    MYCOPLASMA_TYPE_POSITIVE = 'Positive'
    MYCOPLASMA_TYPE_NEGATIVE = 'Negative'

    CHOICE_MYCOPLASMA_TYPE = (
        (MYCOPLASMA_TYPE_POSITIVE, 'Positive'),
        (MYCOPLASMA_TYPE_NEGATIVE, 'Negative')
    )

    selected_date = models.DateTimeField(null=True, blank=True)
    log_type = models.CharField(choices=CHOICE_LOG_TYPE, max_length=400, blank=True, null=True)
    remove_reason = models.CharField(choices=CHOICE_REASON, max_length=400, blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    mycoplasma_type = models.CharField(choices=CHOICE_MYCOPLASMA_TYPE, max_length=400, blank=True, null=True)
    medium_additive_text = models.TextField(null=True, blank=True)
    reason_other = models.TextField(null=True, blank=True)
    cell_culture_line = models.ForeignKey(CellCultureLine, null=True, blank=True, on_delete=models.CASCADE, related_name='events')
    updated_at = models.DateTimeField(auto_now=True)
    removed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cell_culture_event'

    def __str__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO
        """
        return str(self.log_type)
