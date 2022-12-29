from django.urls import path, include

urlpatterns = [
    path('company', include('api_base.urls.company')),
]

