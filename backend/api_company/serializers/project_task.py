from rest_framework import serializers
from api_company.models import ProjectTask
from api_company.serializers import MemberSerializer


class ProjectTaskSerializer(serializers.ModelSerializer):

    member_list = serializers.SerializerMethodField()

    def get_member_list(self, obj):
        members = obj.members.all()
        serializer = MemberSerializer(members, many=True)
        return serializer.data

    class Meta:
        model = ProjectTask
        fields = ('id', 'title', 'members', 'member_list', 'user_id', 'project', 'description', 'start_time', 'end_time', 'status')
