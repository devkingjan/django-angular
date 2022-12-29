from rest_framework import serializers
from api_company.models import StorageTemperature


class StorageTemperatureSerializer(serializers.ModelSerializer):

    class Meta:
        model = StorageTemperature
        fields = ('__all__')

