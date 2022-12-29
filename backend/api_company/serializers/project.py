from rest_framework import serializers
from api_company.models import Project, Member, ProjectTask
from api_company.serializers import ProjectTaskSerializer, MemberSerializer


class ProjectSerializer(serializers.ModelSerializer):

    member_list = serializers.SerializerMethodField()

    def get_member_list(self, obj):
        members = obj.members.all()
        serializer = MemberSerializer(members, many=True)
        return serializer.data

    tasks = serializers.SerializerMethodField()

    def get_tasks(self, obj):
        tasks = obj.tasks.exclude(status=ProjectTask.STATUS_DELETED).all()
        serializer = ProjectTaskSerializer(tasks, many=True)
        return serializer.data

    is_owner = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        if 'user' in self.context:
            user = self.context['user']
            if obj.user_id == user.id:
                return True
            else:
                return False
        else:
            return None

    class Meta:
        model = Project
        fields = ('id', 'name', 'user_id', 'members', 'status', 'member_list', 'tasks', 'is_owner')
