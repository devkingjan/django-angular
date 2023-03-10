from django.conf.urls import url, include
from django.contrib.auth import get_user_model

from authentication import views

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('users', views.UserViewSet)

User = get_user_model()

urlpatterns = [
    url(r'^me/?$', views.UserView.as_view(), name='user'),
    url(
        r'^users/create/?$',
        views.UserCreateView.as_view(),
        name='user-create'
    ),
    url(
        r'^invited-users/create/?$',
        views.InvitedUserSignupView.as_view(),
        name='invited-user-create'
    ),
    url(r'^users/login/?', views.ObtainJwtToken.as_view(), name='jwt-create'),
    url(r'^admin/login/?', views.IgorObtainJwtToken.as_view(), name='jwt-create'),
    url(
        r'^users/update/?$',
        views.UserUpdateView.as_view(),
        name='user-update'
    ),
    url(
        r'^users/delete/?$',
        views.UserDeleteView.as_view(),
        name='user-delete'
    ),
    url(
        r'^users/activate/?$',
        views.ActivationView.as_view(),
        name='user-activate'
    ),
    url(
        r'^{0}/?$'.format(User.USERNAME_FIELD),
        views.SetUsernameView.as_view(),
        name='set_username'
    ),
    url(r'^password/?$', views.SetPasswordView.as_view(), name='set_password'),
    url(
        r'^password/reset/?$',
        views.PasswordResetView.as_view(),
        name='password_reset'
    ),
    url(
        r'^password/reset/confirm/?$',
        views.PasswordResetConfirmView.as_view(),
        name='password_reset_confirm'
    ),
    url(r'^pin/?$', views.SetPinView.as_view(), name='set_pin'),
    url(
        r'^pin/reset/?$',
        views.PinResetView.as_view(),
        name='pin_reset'
    ),
    url(
        r'^pin/reset/confirm/?$',
        views.PinResetConfirmView.as_view(),
        name='pin_reset_confirm'
    ),
    url(r'^$', views.RootView.as_view(), name='root'),
    url(r'^', include(router.urls)),
]
