from rest_framework import serializers
from api_company.models import ProjectTaskComment


class ProjectTaskCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectTaskComment
        fields = ('id', 'comment', 'user_id', 'task')
