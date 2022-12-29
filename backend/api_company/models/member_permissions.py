from django.db import models
from api_company.models import Member


class MemberPermission(models.Model):

    member = models.ForeignKey(Member, blank=True, null=True, on_delete=models.CASCADE, related_name='member_permission')
    permission_id = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'member_permissions'

