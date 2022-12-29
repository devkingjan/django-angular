from django.urls import re_path
from api_base.endpoint import company

urlpatterns = [
    re_path(r'entity', company.CompanyView.as_view()),
    re_path(r'(?P<pk>\d+)/update', company.CompanyUpdateView.as_view()),
    re_path(r'invite', company.InviteView.as_view())
]
