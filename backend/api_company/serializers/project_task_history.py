from rest_framework import serializers
from api_company.models import ProjectTaskHistory
from api_company.serializers import MemberSerializer


class ProjectTaskHistorySerializer(serializers.ModelSerializer):

    member_list = serializers.SerializerMethodField()

    def get_member_list(self, obj):
        members = obj.members.all()
        serializer = MemberSerializer(members, many=True, read_only=True)
        return serializer.data

    class Meta:
        model = ProjectTaskHistory
        fields = ('id', 'title', 'members', 'member_list', 'user_id', 'project', 'description', 'start_time', 'end_time', 'status')


class ProjectTaskHistoryOriginSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectTaskHistory
        fields = ('id', 'title', 'members', 'user_id', 'project', 'description', 'start_time', 'end_time', 'status')
