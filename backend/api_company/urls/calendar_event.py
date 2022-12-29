from django.urls import re_path
from api_company.endpoint import calendar_event

urlpatterns = [
    re_path(r'get', calendar_event.GetCalendarEventView.as_view()),
    re_path(r'create', calendar_event.CalendarEventView.as_view()),
    re_path(r'(?P<pk>\d+)/update', calendar_event.CalendarEventEditView.as_view()),
    re_path(r'(?P<pk>\d+)/delete', calendar_event.CalendarEventDeleteView.as_view()),
]
