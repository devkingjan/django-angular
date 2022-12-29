from django.urls import re_path
from api_company.endpoint import storage_location

urlpatterns = [
    re_path(r'get-temperatures', storage_location.StorageTemperatureView.as_view()),
    re_path(r'create-temperature', storage_location.StorageTemperatureView.as_view()),
    re_path(r'get-equipments', storage_location.StorageEquipmentView.as_view()),
    re_path(r'create-equipment', storage_location.StorageEquipmentView.as_view()),
    re_path(r'get-location$', storage_location.StorageLocationView.as_view()),
    re_path(r'create-location', storage_location.StorageLocationView.as_view()),
    re_path(r'(?P<pk>\d+)/edit-location', storage_location.StorageLocationView.as_view()),
    re_path(r'(?P<pk>\d+)/delete-location', storage_location.StorageLocationView.as_view()),
    re_path(r'(?P<pk>\d+)/get-samples', storage_location.SampleByLocationView.as_view()),
    re_path(r'validate-location', storage_location.StorageLocationValidateView.as_view()),
    re_path(r'get-location-by-temperature$', storage_location.StorageLocationByTemperatureView.as_view()),
    re_path(r'get-equipment-with-box', storage_location.EquipmentWithBoxView.as_view()),
]
