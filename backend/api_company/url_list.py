from django.urls import path, include

urlpatterns = [
    path('member', include('api_company.urls.member')),
    path('experiment/', include('api_company.urls.experiment')),
    path('inventory', include('api_company.urls.inventory')),
    path('storage-location', include('api_company.urls.storage_location')),
    path('calendar', include('api_company.urls.calendar_event')),
    path('task-manager', include('api_company.urls.task_manager')),
    path('file-manager', include('api_company.urls.file_manager')),
    path('cell-culture', include('api_company.urls.cell_culture')),
    path('project', include('api_company.urls.project')),
]

