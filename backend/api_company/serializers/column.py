from rest_framework import serializers
from api_company.models import Column, ExperimentDropdown
from api_company.serializers import ExperimentDropdownSerializer


class ColumnSerializer(serializers.ModelSerializer):

    options = serializers.SerializerMethodField()

    def get_options(self, obj):
        if obj.widget == Column.WIDGET_DROPDOWN:
            dropdowns = ExperimentDropdown.objects.filter(column=obj).all()
            serializer = ExperimentDropdownSerializer(dropdowns, many=True)
            return serializer.data
        else:
            return None

    class Meta:
        model = Column
        fields = ('id', 'name', 'widget', 'order', 'default', 'options', 'template')

