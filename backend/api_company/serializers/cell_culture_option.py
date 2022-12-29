from rest_framework import serializers
from api_company.models import CellCultureOption


class CellCultureOptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = CellCultureOption
        fields = ('__all__')

