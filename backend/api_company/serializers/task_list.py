from rest_framework import serializers
from api_company.models import TaskList


class TaskListSerializer(serializers.ModelSerializer):

    class Meta:
        model = TaskList
        fields = ('id', 'name', 'user_id')
