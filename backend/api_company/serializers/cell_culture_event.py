from rest_framework import serializers
from api_company.models import CellCultureEvent


class CellCultureEventSerializer(serializers.ModelSerializer):

    class Meta:
        model = CellCultureEvent
        fields = ('__all__')

