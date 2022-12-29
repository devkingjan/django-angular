from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND
from django.conf import settings
from api_base.models import Company
from api_company.serializers import MemberSerializer
from api_company.models import Member, MemberPermission, LabAccessMember
from authentication import permission
from authentication.models import User
from authentication.serializers import UserSerializer
from ctrl.mail import send_mail
from ctrl import files


class MemberView(APIView):
    # permission_classes = (permission.IsCompanyAdmin, )

    def get(self, request):
        user = self.request.user
        if 'team' in self.request.query_params and self.request.query_params['team'] == 'true':
            members = User.objects.filter(company_uid=user.company.uid).exclude(email=user.email).all()
            member_serializer = UserSerializer(members, many=True)
            return Response(member_serializer.data)
        else:
            members = Member.objects.all()
            member_serializer = MemberSerializer(members, many=True)
            return Response(member_serializer.data)

    def post(self, request):
        member_data = self.request.data
        member_data['avatar'] = files.get_default_avatar()
        member_serializer = MemberSerializer(data=member_data)
        member_serializer.is_valid(raise_exception=True)
        member_serializer.save()
        return Response(member_serializer.data)


class InviteView(APIView):
    permission_classes = (permission.IsCompanyAdmin, )

    def post(self, request, *args, **kwargs):
        user = self.request.user
        company = Company.objects.filter(email=user.email).exclude(status=Company.STATUS_DELETED).first()
        if not company:
            return Response(data={'details': 'Not exist company'}, status=HTTP_404_NOT_FOUND)
        member_id = self.request.data['member_id']
        member = Member.objects.get(pk=member_id)
        params = {
            'first_name': member.first_name,
            'sender_name': user.first_name,
            'url': '%s/auth/register/member?uid=%s&token=%s' % (settings.MAIN_DOMAIN, member.uid, company.uid)
        }
        subject = "Invite to IGOR"
        send_mail(member.email, subject, 'invite_company.html', params)
        member.status = Member.STATUS_SEND_INVITATION
        member.save()
        return Response()


class PermissionView(APIView):

    permission_classes = (permission.IsCompanyAdmin, )

    def get(self, request, *args, **kwargs):
        member_id = self.kwargs['pk']
        permissions = MemberPermission.objects.filter(member_id=member_id).values_list('permission_id', flat=True).all()
        lab_access_members = LabAccessMember.objects.filter(me_id=member_id).values_list('member_id', flat=True).all()
        response = {
            'permissions': permissions,
            'lab_access_members': lab_access_members
        }
        return Response(response)

    def put(self, request, *args, **kwargs):
        member_id = self.kwargs['pk']
        permissions = self.request.data['permissions']
        MemberPermission.objects.filter(member_id=member_id).delete()
        for permission in permissions:
            MemberPermission.objects.create(member_id=member_id, permission_id=permission)
        members = self.request.data['members']
        LabAccessMember.objects.filter(me_id=member_id).delete()
        for member in members:
            LabAccessMember.objects.create(me_id=member_id, member_id=member)
        return Response()


class LabAccessMemberView(APIView):

    permission_classes = (permission.IsCompanyAdmin, )

    def put(self, request, *args, **kwargs):
        me_id = self.kwargs['pk']
        member_id = self.request.data['member_id']
        checked = self.request.data['checked']
        if checked:
            LabAccessMember.objects.create(me_id=me_id, member_id=member_id)
        else:
            LabAccessMember.objects.filter(me_id=me_id, member_id=member_id).delete()
        return Response()
