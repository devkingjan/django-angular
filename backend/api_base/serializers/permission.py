from rest_framework import serializers
from api_base.models import Company


class PermissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = ('__all__')

