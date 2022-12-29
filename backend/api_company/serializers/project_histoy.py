from rest_framework import serializers
from api_company.models import ProjectHistory, Member
from api_company.serializers import MemberSerializer


class ProjectHistorySerializer(serializers.ModelSerializer):

    member_list = serializers.SerializerMethodField()

    def get_member_list(self, obj):
        members = obj.members.all()
        serializer = MemberSerializer(members, many=True, read_only=True)
        return serializer.data

    class Meta:
        model = ProjectHistory
        fields = ('id', 'name', 'user_id', 'project', 'members', 'status', 'member_list')


class ProjectHistoryOriginSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectHistory
        fields = ('id', 'name', 'user_id', 'project', 'members', 'status')
