from django.urls import re_path
from api_company.endpoint import inventory

urlpatterns = [
    re_path(r'get-databases', inventory.InventoryDatabaseView.as_view()),
    re_path(r'create-database', inventory.InventoryDatabaseView.as_view()),
    re_path(r'edit-database', inventory.InventoryDatabaseView.as_view()),
    re_path(r'(?P<pk>\d+)/get-columns', inventory.InventoryColumnView.as_view()),
    re_path(r'database/(?P<pk>\d+)/get', inventory.InventorySampleDataView.as_view()),
    re_path(r'database/(?P<pk>\d+)/create', inventory.InventorySampleDataView.as_view()),
    re_path(r'database/(?P<pk>\d+)/(?P<sl>\d+)/update', inventory.InventorySampleDataView.as_view()),
    re_path(r'sample/(?P<pk>\d+)/cancel', inventory.InventorySampleDataView.as_view()),
    re_path(r'create-dropdown', inventory.InventoryDropdownView.as_view()),
    re_path(r'column/(?P<pk>\d+)/create-option$', inventory.InventoryDropdownView.as_view()),

]
