from rest_framework import serializers
from api_company.models import InventoryDatabase, StorageLocation, StorageTemperature
from api_company.serializers import StorageTemperatureSerializer


class InventoryDatabaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = InventoryDatabase
        fields = ('__all__')


class InventoryDatabaseWithTemperatureSerializer(serializers.ModelSerializer):

    temperatures = serializers.SerializerMethodField()

    def get_temperatures(self, obj):
        query = StorageLocation.objects.filter(database=obj)
        temperatures = StorageTemperature.objects.filter(pk__in=query.values('storage_temperature'))
        serializer = StorageTemperatureSerializer(temperatures, many=True)
        return serializer.data

    class Meta:
        model = InventoryDatabase
        fields = ('id', 'name', 'temperatures')
