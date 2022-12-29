import boto3
from django.conf import settings
from rest_framework import serializers

from api_company.models import ExperimentEntryVersion
from api_company.choices import ExperimentEntryTypeChoices


class ExperimentEntryVersionSerializer(serializers.ModelSerializer):
    image_source = serializers.SerializerMethodField('get_image')
    experiment = serializers.ReadOnlyField(source='experiment_version.experiment.id')

    def get_image(self, entry):
        if entry.type == ExperimentEntryTypeChoices.IMAGE.name:
            session = boto3.Session(settings.AWS_ACCESS_KEY, settings.AWS_SECRET_ACCESS_KEY)
            s3Client = session.client("s3")
            _uri = s3Client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.context['request'].user.company.bucket_name, 'Key': entry.data}
            )
            return _uri
        else:
            return ''

    class Meta:
        model = ExperimentEntryVersion
        fields = (
            'id',
            'experiment_version',
            'experiment',
            'data',
            'image_source',
            'type',
            'order',
            'column',
            'row',
            'created_at'
        )
