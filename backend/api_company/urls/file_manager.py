from django.urls import re_path, path, include
from api_company.endpoint import file_manager
from rest_framework.routers import DefaultRouter, SimpleRouter


router = DefaultRouter()
router.register(r'user', file_manager.UserFileViewSet)

urlpatterns = [
    re_path(r'entity/', include(router.urls)),
    re_path(r'get-file', file_manager.GetFileView.as_view()),
]
