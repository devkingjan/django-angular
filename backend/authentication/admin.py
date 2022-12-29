from django.contrib import admin
from authentication.models import User


class UserAdmin(admin.ModelAdmin):
    model = User
    list_display = ['id', 'email', 'first_name', 'last_name', 'username', 'role', 'initials', 'last_login',
                    'emergency_first_name', 'emergency_last_name', 'user_role', 'avatar', 'inviter', 'company_uid',
                    'is_active', 'avatar']


admin.site.register(User, UserAdmin)
