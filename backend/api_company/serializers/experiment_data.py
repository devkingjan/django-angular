from rest_framework import serializers
from api_company.models import ExperimentData, ExperimentDropdown


class ExperimentDataSerializer(serializers.ModelSerializer):
    widget = serializers.SerializerMethodField()

    def get_widget(self, obj):
        return obj.column.widget

    option_name = serializers.SerializerMethodField()

    def get_option_name(self, obj):
        if obj.column.widget == 'dropdown':
            option = ExperimentDropdown.objects.get(pk=obj.value)
            if not option:
                return None
            return option.value
        else:
            return None

    column_name = serializers.ReadOnlyField(source='column.name')

    class Meta:
        model = ExperimentData
        fields = ('value', 'widget', 'column', 'experiment', 'option_name', 'column_name')

