import boto3
from rest_framework import serializers
from api_company.models import Member
from ctrl.s3 import presigned_url
from django.conf import settings as const
from authentication.models import User
from authentication.serializers import UserSerializer


class MemberSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()

    def get_user_info(self, obj):
        if obj.status == Member.STATUS_ACCEPT_INVITATION:
            user = User.objects.filter(email=obj.email).first()
            serializer = UserSerializer(user)
            return serializer.data
        else:
            return None

    signed_avatar_url = serializers.SerializerMethodField()

    def get_signed_avatar_url(self, obj):
        try:
            if '4200' not in const.MAIN_DOMAIN:
                s3 = boto3.resource("s3")
                s3_obj = s3.Object(const.BUCKET_NAME, obj.avatar)
                signed_url = presigned_url(s3_obj)
                return signed_url
            else:
                return None
        except:
            return None

    permissions = serializers.SerializerMethodField()

    def get_permissions(self, obj):
        permissions = obj.member_permission.all()
        permission_list = []
        for permission in permissions:
            permission_list.append(permission.id)
        return permission_list

    class Meta:
        model = Member
        fields = ('id', 'first_name', 'last_name', 'role', 'email', 'status', 'uid', 'company_uid', 'avatar',
                  'signed_avatar_url', 'permissions', 'created_at', 'updated_at', 'user_info')

