from rest_framework import serializers
from api_company.models import InventoryDropdown


class InventoryDropdownSerializer(serializers.ModelSerializer):

    class Meta:
        model = InventoryDropdown
        fields = ('__all__')
