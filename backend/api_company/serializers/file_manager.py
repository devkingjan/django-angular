from rest_framework import serializers


class BucketSerializer(serializers.Serializer):
    """
    Serializes the contents of a member's S3 bucket
    """

    name = serializers.CharField(read_only=True)
    type = serializers.CharField(read_only=True)
    size = serializers.CharField(read_only=True)
    permission = serializers.CharField(read_only=True)
    modified = serializers.DateTimeField(read_only=True)
    key = serializers.CharField(read_only=True)
    url = serializers.CharField(read_only=True, required=False)
    folder = serializers.BooleanField(read_only=True)
    is_owner = serializers.BooleanField(read_only=True)
