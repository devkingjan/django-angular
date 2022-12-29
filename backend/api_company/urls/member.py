from django.urls import re_path
from api_company.endpoint import member

urlpatterns = [
    re_path(r'entity', member.MemberView.as_view()),
    re_path(r'invite', member.InviteView.as_view()),
    re_path(r'(?P<pk>\d+)/get-permission', member.PermissionView.as_view()),
    re_path(r'(?P<pk>\d+)/update-permission', member.PermissionView.as_view()),
    re_path(r'(?P<pk>\d+)/update-access-member', member.LabAccessMemberView.as_view()),
]
