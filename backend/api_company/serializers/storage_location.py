from rest_framework import serializers
from api_company.models import StorageLocation


class StorageLocationSerializer(serializers.ModelSerializer):

    class Meta:
        model = StorageLocation
        fields = ('__all__')

