from rest_framework import serializers
from api_company.models import CellLineCurrentStatus


class CellLineCurrentStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = CellLineCurrentStatus
        fields = ('id', 'uid', 'name', 'origin', 'generic_modification', 'how_started', 'date_taken', 'passage_number',
                  'culture_medium', 'medium_additive', 'mycoplasmas_state', 'mycoplasmas_date',
                  'culture_property', 'note', 'user_id',
                  'updated_at', 'created_at', 'ended_at', 'removed', 'cloned_cell_line',
                  'received_scientist')

