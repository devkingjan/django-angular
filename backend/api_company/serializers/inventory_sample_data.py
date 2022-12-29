from rest_framework import serializers
from api_company.models import InventorySampleData, InventoryDropdown


class InventorySampleDataSerializer(serializers.ModelSerializer):

    widget = serializers.SerializerMethodField()

    def get_widget(self, obj):
        return obj.column.widget

    option_name = serializers.SerializerMethodField()

    def get_option_name(self, obj):
        if obj.column.widget == 'dropdown':
            option = InventoryDropdown.objects.get(pk=obj.value)
            if not option:
                return None
            return option.value
        else:
            return None

    class Meta:
        model = InventorySampleData
        fields = ('id', 'value', 'widget', 'column', 'inventory_sample', 'option_name')

