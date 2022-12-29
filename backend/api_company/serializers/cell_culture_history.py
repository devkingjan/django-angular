from rest_framework import serializers
from api_company.models import CellStatusHistory
from api_company.serializers import CellCultureLineOriginSerializer, CellCultureEventSerializer


class CellStatusHistorySerializer(serializers.ModelSerializer):

    cell_line = CellCultureLineOriginSerializer(many=False)
    cell_event = CellCultureEventSerializer(many=False)

    class Meta:
        model = CellStatusHistory
        fields = ('id', 'cell_event', 'cell_line', 'log_type', 'latest', 'removed', 'ui_event_datetime', 'created_at')

