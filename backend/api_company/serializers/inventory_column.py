from rest_framework import serializers
from api_company.models import InventoryColumn, InventoryDropdown
from api_company.serializers import InventoryDropdownSerializer


class InventoryColumnSerializer(serializers.ModelSerializer):

    options = serializers.SerializerMethodField()

    def get_options(self, obj):
        if obj.widget == InventoryColumn.WIDGET_DROPDOWN:
            dropdowns = InventoryDropdown.objects.filter(column=obj).all()
            serializer = InventoryDropdownSerializer(dropdowns, many=True)
            return serializer.data
        else:
            return None

    class Meta:
        model = InventoryColumn
        fields = ('id', 'name', 'widget', 'order', 'default', 'database', 'options')

