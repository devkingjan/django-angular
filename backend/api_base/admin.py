from django.contrib import admin
from api_base import models


@admin.register(models.Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('institution', 'first_name', 'last_name', 'email', 'db_name', 'database', 'uid', 'created_at', 'status',
                    'updated_at')


@admin.register(models.Database)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('host_name', 'db_name', 'user_name', 'password', 'status')
