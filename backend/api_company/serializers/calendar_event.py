from rest_framework import serializers
from api_company.models import CalendarEvent, Member
from api_company.serializers import MemberSerializer


class CalendarEventSerializer(serializers.ModelSerializer):

    class Meta:
        model = CalendarEvent
        fields = ('__all__')


class GetCalendarEventSerializer(serializers.ModelSerializer):
    is_owner = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        user = self.context['user']
        if obj.user_id == user.id:
            return True
        else:
            return False

    member_list = serializers.SerializerMethodField()

    def get_member_list(self, obj):
        members = obj.members.all()
        serializers = MemberSerializer(members, many=True)
        return serializers.data

    class Meta:
        model = CalendarEvent
        fields = ('id', 'start', 'end', 'title', 'allDay', 'color', 'resizable', 'draggable', 'meta', 'members',
                  'is_owner', 'member_list')

