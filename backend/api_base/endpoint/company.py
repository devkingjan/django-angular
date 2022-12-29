from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.status import HTTP_400_BAD_REQUEST
from api_base.serializers import CompanySerializer
from api_base.models import Company, Database
from ctrl.mail import send_mail
from rest_framework.response import Response
from django.conf import settings
from authentication import permission


class CompanyView(generics.ListCreateAPIView):
    permission_classes = (permission.IsIgorAdmin,)
    serializer_class = CompanySerializer
    def get_queryset(self):
        query = Company.objects.exclude(status=Company.STATUS_DELETED)
        return query

    def create(self, request, *args, **kwargs):
        available_database = Database.objects.filter(status=False).first()
        if not available_database:
            return Response(
                data={
                    'detail': 'No available database, Please create new database before create new company',
                },
                status=HTTP_400_BAD_REQUEST
            )
        self.request.data['database'] = available_database.id
        serializer = CompanySerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        available_database.status = True
        available_database.save()
        return Response(serializer.data)


class CompanyUpdateView(generics.UpdateAPIView):
    permission_classes = (permission.IsIgorAdmin,)
    serializer_class = CompanySerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        query = Company.objects.filter(pk=pk)
        return query


class InviteView(APIView):
    permission_classes = (permission.IsIgorAdmin, )

    def post(self, request, *args, **kwargs):
        company_id = self.request.data['company_id']
        company = Company.objects.get(pk=company_id)
        params = {
            'first_name': company.first_name,
            'url': '%s/auth/register/company?uid=%s' % (settings.MAIN_DOMAIN, company.uid)
        }
        subject = "Invite to IGOR"
        send_mail(company.email, subject, 'invite_admin.html', params)
        company.status = Company.STATUS_SEND_INVITATION
        company.save()
        return Response()


