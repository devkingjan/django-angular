from rest_framework import serializers
from api_company.models import ProjectTaskEvent
from api_company.serializers import ProjectHistoryOriginSerializer, ProjectTaskHistoryOriginSerializer


class ProjectTaskEventSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectTaskEvent
        fields = ('id', 'comment', 'user_id', 'first_name', 'last_name', 'type', 'project', 'task', 'after_project', 'after_task', 'before_project',
                  'before_task', 'description', 'created_at')


class ProjectTaskEventViewSerializer(serializers.ModelSerializer):

    after_project = ProjectHistoryOriginSerializer(many=False)
    after_task = ProjectTaskHistoryOriginSerializer(many=False)
    before_project = ProjectHistoryOriginSerializer(many=False)
    before_task = ProjectTaskHistoryOriginSerializer(many=False)

    class Meta:
        model = ProjectTaskEvent
        fields = ('id', 'comment', 'user_id', 'first_name', 'last_name', 'type', 'project', 'task', 'after_project', 'after_task', 'before_project',
                  'before_task', 'description', 'created_at')
