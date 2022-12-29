from rest_framework import serializers
from api_company.models import Task


class TaskSerializer(serializers.ModelSerializer):

    task_list_name = serializers.SerializerMethodField()

    def get_task_list_name(self, obj):
        if obj.task_list:
            return obj.task_list.name
        else:
            return ''

    class Meta:
        model = Task
        fields = ('id', 'name', 'user_id', 'due_date', 'task_list', 'completed', 'completed_at', 'task_list_name')
