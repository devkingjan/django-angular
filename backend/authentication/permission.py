from rest_framework import permissions
from authentication.models import User


class IsIgorAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return user.user_role == User.ROLE_IGOR_ADMIN


class IsCompanyAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return user.user_role == User.ROLE_COMPANY_ADMIN or user.user_role == User.ROLE_IGOR_ADMIN


class IsRegularAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return user.user_role == User.ROLE_REGULAR_USER
