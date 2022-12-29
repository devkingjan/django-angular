from rest_framework import serializers
from api_company.models import InventorySampleLocation
from api_company.serializers import InventorySampleSerializer
from api_company.models import InventorySampleData


class InventorySampleLocationSerializer(serializers.ModelSerializer):

    class Meta:
        model = InventorySampleLocation
        fields = ('id', 'sample', 'location', 'position')


class InventorySamplesByLocationSerializer(serializers.ModelSerializer):

    sample_uid = serializers.SerializerMethodField()

    def get_sample_uid(self, obj):
        return obj.sample.uid

    name = serializers.SerializerMethodField()

    def get_name(self, obj):
        sample_data = InventorySampleData.objects.filter(inventory_sample=obj.sample, column__name='Name').first()
        if sample_data:
            return sample_data.value
        else:
            return ''

    class Meta:
        model = InventorySampleLocation
        fields = ('sample', 'sample_uid', 'position', 'name')
