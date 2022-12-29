from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from api_company.models import CalendarEvent, Member
from api_company.serializers import CalendarEventSerializer, GetCalendarEventSerializer
from django.db.models import Q


class GetCalendarEventView(APIView):

    def get(self, request):
        user = self.request.user
        member = Member.objects.filter(email=user.email).first()
        if member:
            calendar_events = CalendarEvent.objects.filter(Q(user_id=user.id) | Q(members=member)).distinct()
        else:
            calendar_events = CalendarEvent.objects.filter(user_id=user.id).all()
        serializer = GetCalendarEventSerializer(calendar_events, many=True, context={'user': user})
        return Response(serializer.data)


class CalendarEventView(APIView):

    serializer_class = CalendarEventSerializer

    def post(self, request):
        user = self.request.user
        data = self.request.data
        data['user_id'] = self.request.user.id
        serializer = CalendarEventSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        event = CalendarEvent.objects.get(pk=serializer.data['id'])
        serializer = GetCalendarEventSerializer(event, context={'user': user})
        return Response(serializer.data)


class CalendarEventEditView(generics.UpdateAPIView):
    serializer_class = CalendarEventSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        query = CalendarEvent.objects.filter(pk=pk)
        return query


class CalendarEventDeleteView(generics.DestroyAPIView):
    serializer_class = CalendarEventSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        query = CalendarEvent.objects.filter(pk=pk)
        return query
