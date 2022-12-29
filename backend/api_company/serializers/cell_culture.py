from rest_framework import serializers
from api_company.models import CellCultureLine
from api_company.serializers import CellCultureEventSerializer, CellLineCurrentStatusSerializer
from authentication.models import User
from authentication.serializers import UserSerializer


class CellCultureLineSerializer(serializers.ModelSerializer):

    events = serializers.SerializerMethodField()

    def get_events(self, obj):
        events = obj.events.filter(removed=False).order_by('-selected_date', '-id').all()
        serializers = CellCultureEventSerializer(events, many=True)
        return serializers.data

    latest_update = serializers.SerializerMethodField()

    def get_latest_update(self, obj):
        event = obj.events.exclude(log_type__in=['add_note', 'add_culture_medium_additive', 'log_mycoplasma_test']).order_by('-selected_date', '-id').first()
        if not event:
            return {'date': obj.date_taken, 'type': 'P'}
        else:
            _type = 'M'
            if event.log_type == 'log_passage':
                _type = 'P'
            return {'date': event.selected_date, 'type': _type}

    current_status = serializers.SerializerMethodField()

    def get_current_status(self, obj):
        try:
            cell_line_current_status = obj.current_status.get()
            serializer = CellLineCurrentStatusSerializer(cell_line_current_status)
            return serializer.data
        except:
            return None

    class Meta:
        model = CellCultureLine
        fields = ('id', 'uid', 'name', 'origin', 'generic_modification', 'how_started', 'date_taken', 'passage_number',
                  'culture_medium', 'medium_additive', 'mycoplasmas_state', 'mycoplasmas_date', 'culture_property', 'note', 'user_id',
                  'latest_update', 'updated_at', 'created_at', 'ended_at', 'removed', 'events',
                  'cloned_cell_line', 'received_scientist', 'current_status')


class CellCultureLineOriginSerializer(serializers.ModelSerializer):

    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        user = User.objects.using('default').get(pk=obj.user_id)
        serializer = UserSerializer(user, many=False)
        return serializer.data

    cloned_cell = serializers.SerializerMethodField()

    def get_cloned_cell(self, obj):
        if obj.cloned_cell_line:
            cell_line = CellCultureLine.objects.get(pk=obj.cloned_cell_line)
            return cell_line.name
        else:
            return None

    class Meta:
        model = CellCultureLine
        fields = ('id', 'uid', 'name', 'origin', 'generic_modification', 'how_started', 'date_taken', 'passage_number',
                  'culture_medium', 'medium_additive', 'mycoplasmas_state', 'mycoplasmas_date', 'culture_property', 'note', 'user_id',
                  'updated_at', 'created_at', 'ended_at', 'removed', 'user', 'cloned_cell_line', 'cloned_cell',
                  'received_scientist')

