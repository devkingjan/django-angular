from rest_framework import serializers
from api_company.models import ExperimentDropdown


class ExperimentDropdownSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExperimentDropdown
        fields = ('__all__')
