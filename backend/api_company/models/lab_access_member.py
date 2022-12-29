from django.db import models
from api_company.models import Member


class LabAccessMember(models.Model):

    me = models.ForeignKey(Member, blank=True, null=True, on_delete=models.CASCADE, related_name='me')
    member = models.ForeignKey(Member, blank=True, null=True, on_delete=models.CASCADE, related_name='access_member')

    class Meta:
        db_table = 'lab_access_members'

