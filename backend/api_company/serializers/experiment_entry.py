import boto3
from django.conf import settings
from rest_framework import serializers

from api_company.choices import ExperimentEntryTypeChoices
from api_company.models import ExperimentEntry


class ExperimentEntrySerializer(serializers.ModelSerializer):
    file_source = serializers.SerializerMethodField()
    file_name = serializers.SerializerMethodField()

    def get_file_source(self, entry):
        if entry.type == ExperimentEntryTypeChoices.IMAGE.name or entry.type == ExperimentEntryTypeChoices.FILE.name:
            session = boto3.Session(settings.AWS_ACCESS_KEY, settings.AWS_SECRET_ACCESS_KEY)
            s3Client = session.client("s3")
            _uri = s3Client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.context['request'].user.company.bucket_name, 'Key': entry.data}
            )
            return _uri
        else:
            return ''

    def get_file_name(self, entry):
        if entry.type == ExperimentEntryTypeChoices.IMAGE.name or entry.type == ExperimentEntryTypeChoices.FILE.name:
            data = entry.data.split('/')
            return data[len(data) - 1]
        else:
            return ''

    class Meta:
        model = ExperimentEntry
        fields = (
            'id',
            'experiment',
            'data',
            'file_source',
            'file_name',
            'type',
            'order',
            'column',
            'row',
            'created_at'
        )
