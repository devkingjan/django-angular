from django.urls import re_path, path, include
from api_company.endpoint import cell_culture


urlpatterns = [
    re_path(r'options', cell_culture.CellCultureOptionView.as_view()),
    re_path(r'entity', cell_culture.CellCultureView.as_view()),
    re_path(r'history', cell_culture.CellStatusHistoryView.as_view()),
    re_path(r'remove/(?P<pk>\d+)$', cell_culture.DeleteHistoryView.as_view()),
    re_path(r'event', cell_culture.CellCultureEventView.as_view()),
]
