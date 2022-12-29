from rest_framework import serializers

from api_company.models import ExperimentVersion


class ExperimentVersionSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExperimentVersion
        fields = (
            'id',
            'experiment',
            'description',
            'created_at'
        )
