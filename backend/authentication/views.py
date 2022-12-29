import boto3
from django.contrib.auth.hashers import make_password
from loguru import logger
from datetime import datetime
from django.contrib.auth.tokens import default_token_generator
from django.urls.exceptions import NoReverseMatch
from django.db import connections
from django.db.utils import load_backend
from django.conf import settings as const
from django.http import HttpResponseForbidden
from django.utils.timezone import now
from rest_framework import generics, permissions, status, views, viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework_jwt.views import JSONWebTokenAPIView
from authentication import utils, signals
from authentication.compat import get_user_email, get_user_email_field_name
from authentication.conf import settings
from .models import User
from .serializers import UserSerializer, JSONWebTokenSerializer, UserCreateSerializer
from api_base.models import Company
from api_company.models import Member
from ctrl import files


class RootView(views.APIView):
    """
    Root endpoint - use one of sub endpoints.
    """
    permission_classes = [permissions.AllowAny]

    def _get_url_names(self, urllist):
        names = []
        for entry in urllist:
            if hasattr(entry, 'url_patterns'):
                names.extend(self._get_url_names(entry.url_patterns))
            else:
                names.append(entry.name)
        return names

    def aggregate_djoser_urlpattern_names(self):
        from djoser.urls import base, authtoken
        urlpattern_names = self._get_url_names(base.urlpatterns)
        urlpattern_names += self._get_url_names(authtoken.urlpatterns)
        urlpattern_names += self._get_jwt_urlpatterns()

        return urlpattern_names

    def get_urls_map(self, request, urlpattern_names, fmt):
        urls_map = {}
        for urlpattern_name in urlpattern_names:
            try:
                url = reverse(urlpattern_name, request=request, format=fmt)
            except NoReverseMatch:
                url = ''
            urls_map[urlpattern_name] = url
        return urls_map

    def get(self, request, fmt=None):
        urlpattern_names = self.aggregate_djoser_urlpattern_names()
        urls_map = self.get_urls_map(request, urlpattern_names, fmt)
        return Response(urls_map)

    def _get_jwt_urlpatterns(self):
        try:
            from djoser.urls import jwt
            return self._get_url_names(jwt.urlpatterns)
        except ImportError:
            return []


class IgorObtainJwtToken(JSONWebTokenAPIView):
    """
    Get jwt token
    @ params:  username, password, store
    """
    serializer_class = JSONWebTokenSerializer

    def post(self, request, *args, **kwargs):
        logger.debug("user token creating}")
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.object.get('user') or request.user
            if user.user_role != User.ROLE_IGOR_ADMIN:
                return HttpResponseForbidden({'detail': "Forbidden Error"})
            token = serializer.object.get('token')
            logger.debug("user token created for {}", user.email)
            response = Response({
                'token': token
            })
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ObtainJwtToken(JSONWebTokenAPIView):
    """
    Get jwt token
    @ params:  username, password, store
    """
    serializer_class = JSONWebTokenSerializer

    def post(self, request, *args, **kwargs):
        logger.debug("user token creating}")
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = serializer.object.get('user') or request.user
            token = serializer.object.get('token')
            logger.debug("user token created for {}", user.email)
            response = Response({
                'token': token
            })
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InvitedUserSignupView(APIView):
    """
    Use this endpoint to register invited user.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user_role = 0
        invited_user = None
        inviter = None
        company = None
        avatar = None
        user_role = self.request.data['user_role']
        member_id = self.request.data['memberUid']
        # avatar = files.get_default_avatar()
        company_uid = None
        if user_role == 'company':
            user_role = User.ROLE_COMPANY_ADMIN
            try:
                invited_user = Company.objects.filter(uid=member_id).first()
                company = invited_user
                company_uid = str(invited_user.uid)
                invited_user.initialize_bucket()
                bucket = company.bucket_name
                self.create_s3_folder(bucket, 'share/%s' % const.FOLDER_PROTOCOL)
                self.create_s3_folder(bucket, 'share/%s' % const.FOLDER_TEMPLATE)
                self.create_s3_folder(bucket, 'share/%s' % const.FOLDER_BUFFER)
                self.create_s3_folder(bucket, const.FOLDER_STAGING_MOBILE)

            except Exception as exc:
                return Response({'detail': 'Not Invited User'}, status=status.HTTP_400_BAD_REQUEST)
        elif user_role == 'member':
            company_id = self.request.data['companyUid']
            company = Company.objects.filter(uid=company_id).first()
            company_uid = str(company.uid)
            inviter = User.objects.get(email=company.email).id
            self.connect_to_company_db(company)
            user_role = User.ROLE_REGULAR_USER
            try:
                db_name = str(company.id)
                invited_user = Member.objects.using(db_name).filter(uid=member_id).first()
            except Exception as exc:
                return Response({'detail': 'Not Invited User'}, status=status.HTTP_400_BAD_REQUEST)

        if not invited_user:
            return Response({'detail': 'Not Invited User'}, status=status.HTTP_400_BAD_REQUEST)
        user = {
            'username': self.request.data['user_name'],
            'initials': self.request.data['initials'],
            'inviter': inviter,
            'email': invited_user.email,
            'first_name': invited_user.first_name,
            'last_name': invited_user.last_name,
            'password': self.request.data['password'],
            'pin': self.request.data['pin'],
            'company_uid': company_uid,
            'is_active': True
        }
        create_user_serializer = UserCreateSerializer(data=user)
        create_user_serializer.is_valid(raise_exception=True)
        create_user_serializer.save()
        user_id = create_user_serializer.data['id']
        user = User.objects.get(pk=user_id)
        user.is_active = True
        user.user_role = user_role
        user.avatar = avatar
        user.set_pin(self.request.data['pin'])
        user.save()
        invited_user.status = Member.STATUS_ACCEPT_INVITATION
        invited_user.save()
        # initialize bucket
        self.initialize_member_default_folder(company, user)

        return Response("success")

    def connect_to_company_db(self, company):
        database = company.database
        db_name = str(company.id)
        new_db = {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': database.db_name,
            'USER': database.user_name,
            'PASSWORD': database.password,
            'HOST': database.host_name,
            'PORT': 3306,  # Server Port
            'ATOMIC_REQUESTS': True,
            'OPTIONS': {
                'charset': 'utf8mb4'  # This is the important line
            }
        }
        const.DATABASES[db_name] = new_db
        connections.ensure_defaults('company')
        connections.prepare_test_settings('company')
        db = connections.databases['company']
        backend = load_backend(db['ENGINE'])
        backend.DatabaseWrapper(db, 'company')
        conn = connections['company']
        conn.connect()

    def initialize_member_default_folder(self, company, user):
        """
        Creates a new overlay folder in the seller's S3 bucket
        """
        bucket = company.bucket_name
        self.create_s3_folder(bucket, '%s' % user.folder_name)
        self.create_s3_folder(bucket, '%s/public' % user.folder_name)
        self.create_s3_folder(bucket, '%s/private' % user.folder_name)
        self.create_s3_folder(bucket, '%s/private/%s' % (user.folder_name, const.FOLDER_EXPERIMENT))
        self.create_s3_folder(bucket, '%s/private/%s' % (user.folder_name, const.FOLDER_LANDING))

    def create_s3_folder(self, bucket, name):
        session = boto3.Session(const.AWS_ACCESS_KEY, const.AWS_SECRET_ACCESS_KEY)
        s3 = session.client("s3")
        try:
            s3.get_object(Bucket=bucket, Key="%s/" % name)
            logger.debug(
                'Found existing folder {folder}/ in bucket "{bucket}"', folder=name, bucket=bucket,
            )
        except s3.exceptions.NoSuchKey:
            s3.put_object(Bucket=bucket, Key="%s/" % name)
            logger.debug(
                'Created new folder {folder}/ in bucket "{bucket}"', folder=name, bucket=bucket,
            )


class UserCreateView(generics.CreateAPIView):
    """
    Use this endpoint to register new user.
    """
    serializer_class = settings.SERIALIZERS.user_create
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        signals.user_registered.send(
            sender=self.__class__, user=user, request=self.request
        )
        context = {'user': user}
        to = [get_user_email(user)]
        if settings.SEND_ACTIVATION_EMAIL:
            settings.EMAIL.activation(self.request, context).send(to)
        elif settings.SEND_CONFIRMATION_EMAIL:
            settings.EMAIL.confirmation(self.request, context).send(to)


class UserDeleteView(generics.CreateAPIView):
    """
    Use this endpoint to remove actually authenticated user
    """
    serializer_class = settings.SERIALIZERS.user_delete
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)

        utils.logout_user(self.request)
        instance.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class TokenCreateView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to obtain user authentication token.
    """
    serializer_class = settings.SERIALIZERS.token_create
    permission_classes = [permissions.AllowAny]

    def _action(self, serializer):
        token = utils.login_user(self.request, serializer.user)
        token_serializer_class = settings.SERIALIZERS.token
        return Response(
            data=token_serializer_class(token).data,
            status=status.HTTP_200_OK,
        )


class TokenDestroyView(views.APIView):
    """
    Use this endpoint to logout user (remove user authentication token).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        utils.logout_user(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PasswordResetView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to send email to user with password reset link.
    """
    serializer_class = settings.SERIALIZERS.password_reset
    permission_classes = [permissions.AllowAny]

    _users = None

    def _action(self, serializer):
        for user in self.get_users(serializer.data['email']):
            self.send_password_reset_email(user)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_users(self, email):
        if self._users is None:
            email_field_name = get_user_email_field_name(User)
            users = User._default_manager.filter(**{
                email_field_name + '__iexact': email
            })
            self._users = [
                u for u in users if u.is_active and u.has_usable_password()
            ]
        return self._users

    def send_password_reset_email(self, user):
        context = {'user': user}
        to = [get_user_email(user)]
        settings.EMAIL.password_reset(self.request, context).send(to)


class SetPasswordView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to change user password.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if settings.SET_PASSWORD_RETYPE:
            return settings.SERIALIZERS.set_password_retype
        return settings.SERIALIZERS.set_password

    def _action(self, serializer):
        self.request.user.set_password(serializer.data['new_password'])
        self.request.user.pwd_updated = datetime.now().date()
        self.request.user.save()

        if settings.LOGOUT_ON_PASSWORD_CHANGE:
            utils.logout_user(self.request)

        return Response(status=status.HTTP_204_NO_CONTENT)


class PasswordResetConfirmView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to finish reset password process.
    """
    permission_classes = [permissions.AllowAny]
    token_generator = default_token_generator

    def get_serializer_class(self):
        if settings.PASSWORD_RESET_CONFIRM_RETYPE:
            return settings.SERIALIZERS.password_reset_confirm_retype
        return settings.SERIALIZERS.password_reset_confirm

    def _action(self, serializer):
        serializer.user.set_password(serializer.data['new_password'])
        if hasattr(serializer.user, 'last_login'):
            serializer.user.last_login = now()
        serializer.user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SetPinView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to change user pin.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if settings.SET_PIN_RETYPE:
            return settings.SERIALIZERS.set_pin_retype
        return settings.SERIALIZERS.set_pin

    def _action(self, serializer):
        self.request.user.set_pin(serializer.data['new_pin'])
        self.request.user.pin_updated = datetime.now()
        self.request.user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class PinResetView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to send email to user with pin reset link.
    """
    serializer_class = settings.SERIALIZERS.pin_reset
    permission_classes = [permissions.AllowAny]

    _users = None

    def _action(self, serializer):
        for user in self.get_users(serializer.data['email']):
            self.send_pin_reset_email(user)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_users(self, email):
        if self._users is None:
            email_field_name = get_user_email_field_name(User)
            users = User._default_manager.filter(**{
                email_field_name + '__iexact': email
            })
            self._users = [
                u for u in users if u.is_active and u.has_usable_pin()
            ]
        return self._users

    def send_pin_reset_email(self, user):
        context = {'user': user}
        to = [get_user_email(user)]
        settings.EMAIL.pin_reset(self.request, context).send(to)


class PinResetConfirmView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to finish reset password process.
    """
    permission_classes = [permissions.AllowAny]
    token_generator = default_token_generator

    def get_serializer_class(self):
        if settings.PIN_RESET_CONFIRM_RETYPE:
            return settings.SERIALIZERS.pin_reset_confirm_retype
        return settings.SERIALIZERS.pin_reset_confirm

    def _action(self, serializer):
        serializer.user.set_pin(serializer.data['new_pin'])
        if hasattr(serializer.user, 'last_login'):
            serializer.user.last_login = now()
        serializer.user.pin_updated = now()
        serializer.user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ActivationView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to activate user account.
    """
    serializer_class = settings.SERIALIZERS.activation
    permission_classes = [permissions.AllowAny]
    token_generator = default_token_generator

    def _action(self, serializer):
        user = serializer.user
        user.is_active = True
        user.save()

        signals.user_activated.send(
            sender=self.__class__, user=user, request=self.request
        )

        if settings.SEND_CONFIRMATION_EMAIL:
            context = {'user': user}
            to = [get_user_email(user)]
            settings.EMAIL.confirmation(self.request, context).send(to)

        return Response(status=status.HTTP_204_NO_CONTENT)


class SetUsernameView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to change user username.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if settings.SET_USERNAME_RETYPE:
            return settings.SERIALIZERS.set_username_retype
        return settings.SERIALIZERS.set_username

    def _action(self, serializer):
        user = self.request.user
        new_username = serializer.data['new_' + User.USERNAME_FIELD]

        setattr(user, User.USERNAME_FIELD, new_username)
        if settings.SEND_ACTIVATION_EMAIL:
            user.is_active = False
            context = {'user': user}
            to = [get_user_email(user)]
            settings.EMAIL.activation(self.request, context).send(to)
        user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class UserView(generics.RetrieveUpdateAPIView):
    """
    Use this endpoint to retrieve/update user.
    """
    model = User
    serializer_class = settings.SERIALIZERS.user
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, *args, **kwargs):
        return self.request.user

    def perform_update(self, serializer):
        super(UserView, self).perform_update(serializer)
        user = serializer.instance
        if settings.SEND_ACTIVATION_EMAIL and not user.is_active:
            context = {'user': user}
            to = [get_user_email(user)]
            settings.EMAIL.activation(self.request, context).send(to)


class UserUpdateView(APIView):
    """
    Use this endpoint to retrieve/update user.
    """

    def put(self, *args, **kwargs):
        if 'avatar' in self.request.data:
            upload_file = self.request.data['avatar']
            filename = files.safe_filename('avatar.png')
            content_type = upload_file.split(';')[0].split(':')[1]
            upload_file = upload_file.split(';')[1].split(',')[1]
            if not content_type in ['image/png', 'image/jpeg']:
                error = {"detail": "Invalid image type"}
                return Response(error, status=status.HTTP_400_BAD_REQUEST)
            key = files.uploadAvatar(filename, upload_file, content_type)
            self.request.data['avatar'] = key

        user = self.request.user
        serializer = UserSerializer(user, data=self.request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(UserCreateView, viewsets.ModelViewSet):
    serializer_class = settings.SERIALIZERS.user
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    token_generator = default_token_generator

    def get_permissions(self):
        if self.action in ['create', 'confirm']:
            self.permission_classes = [permissions.AllowAny]
        elif self.action == 'list':
            self.permission_classes = [permissions.IsAdminUser]
        return super(UserViewSet, self).get_permissions()

    def get_serializer_class(self):
        if self.action == 'me':
            # Use the current user serializer on 'me' endpoints
            self.create_connect_account(self.request.user)
            self.serializer_class = settings.SERIALIZERS.current_user

        if self.action == 'create':
            return settings.SERIALIZERS.user_create

        elif self.action == 'remove' or (
                self.action == 'me' and self.request and
                self.request.method == 'DELETE'
        ):
            return settings.SERIALIZERS.user_delete

        elif self.action == 'confirm':
            return settings.SERIALIZERS.activation

        elif self.action == 'change_username':
            if settings.SET_USERNAME_RETYPE:
                return settings.SERIALIZERS.set_username_retype

            return settings.SERIALIZERS.set_username

        return self.serializer_class

    def get_instance(self):
        return self.request.user

    def perform_update(self, serializer):
        super(UserViewSet, self).perform_update(serializer)
        user = serializer.instance
        if settings.SEND_ACTIVATION_EMAIL and not user.is_active:
            context = {'user': user}
            to = [get_user_email(user)]
            settings.EMAIL.activation(self.request, context).send(to)

    def perform_destroy(self, instance):
        utils.logout_user(self.request)
        super(UserViewSet, self).perform_destroy(instance)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @list_route(['get', 'put', 'patch', 'delete'])
    def me(self, request, *args, **kwargs):
        self.get_object = self.get_instance
        if request.method == 'GET':
            return self.retrieve(request, *args, **kwargs)
        elif request.method == 'PUT':
            return self.update(request, *args, **kwargs)
        elif request.method == 'PATCH':
            return self.partial_update(request, *args, **kwargs)
        elif request.method == 'DELETE':
            return self.destroy(request, *args, **kwargs)

    @list_route(['post'])
    def confirm(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        user.is_active = True
        user.save()

        signals.user_activated.send(
            sender=self.__class__, user=user, request=self.request
        )

        if settings.SEND_CONFIRMATION_EMAIL:
            context = {'user': user}
            to = [get_user_email(user)]
            settings.EMAIL.confirmation(self.request, context).send(to)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @list_route(['post'])
    def change_username(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.request.user
        new_username = serializer.data['new_' + User.USERNAME_FIELD]

        setattr(user, User.USERNAME_FIELD, new_username)
        if settings.SEND_ACTIVATION_EMAIL:
            user.is_active = False
            context = {'user': user}
            to = [get_user_email(user)]
            settings.EMAIL.activation(self.request, context).send(to)
        user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
