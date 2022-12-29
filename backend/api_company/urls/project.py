from django.urls import re_path, path, include
from rest_framework.routers import DefaultRouter
from api_company.endpoint import project


router = DefaultRouter()
router.register(r'entity', project.ProjectViewSet, base_name='project')
router.register(r'task', project.ProjectTaskViewSet, base_name='task')
router.register(r'comment', project.ProjectTaskCommentViewSet, base_name='comment')

urlpatterns = [
    re_path(r'set/', include(router.urls)),
]

