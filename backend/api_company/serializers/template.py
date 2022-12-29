from rest_framework import serializers
from api_company.models import Template


class TemplateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Template
        fields = ('__all__')

