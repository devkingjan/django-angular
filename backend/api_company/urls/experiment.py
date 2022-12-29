from django.urls import re_path, include
from rest_framework.routers import DefaultRouter

from api_company.endpoint import experiment

router = DefaultRouter()
router.register(r'main', experiment.ExperimentViewSet)
router.register(r'version', experiment.ExperimentVersionViewSet)
router.register(r'entry', experiment.ExperimentEntryViewSet)
router.register(r'entry-version', experiment.ExperimentEntryVersionViewSet)

urlpatterns = [
    re_path(r'get-templates', experiment.ExperimentTemplateView.as_view()),
    re_path(r'create-template', experiment.ExperimentTemplateView.as_view()),
    re_path(r'edit-template', experiment.ExperimentTemplateView.as_view()),
    re_path(r'(?P<pk>\d+)/get-columns', experiment.ColumnView.as_view()),
    re_path(r'template/recent-exp', experiment.RecentExperimentDataView.as_view()),
    re_path(r'template/(?P<pk>\d+)/get', experiment.ExperimentDataView.as_view()),
    re_path(r'template/(?P<pk>\d+)/create', experiment.ExperimentDataView.as_view()),
    re_path(r'template/(?P<pk>\d+)/update', experiment.ExperimentDataView.as_view()),
    re_path(r'template/(?P<pk>\d+)/cancel', experiment.ExperimentDataView.as_view()),
    re_path(r'create-dropdown', experiment.ExperimentDropdownView.as_view()),
    re_path(r'column/(?P<pk>\d+)/create-option$', experiment.ExperimentDropdownView.as_view()),
    re_path(r'^sign/$', experiment.ExperimentSignView.as_view()),
    re_path(r'(?P<pk>\d+)/assign-user', experiment.ExperimentAssignUserView.as_view()),
    re_path(r'mobile-list/', experiment.ExperimentMobileListView.as_view()),
    re_path(r'mobile-upload/', experiment.ExperimentMobileUploadView.as_view()),
]

urlpatterns += router.urls
