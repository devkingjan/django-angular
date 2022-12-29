import base64
import datetime
import json

from rest_framework import mixins, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from django.db import transaction
from django.conf import settings
from django.core.paginator import Paginator
from rest_framework.status import HTTP_500_INTERNAL_SERVER_ERROR, HTTP_401_UNAUTHORIZED
from django.conf import settings as const

from api_company.choices import ExperimentEntryTypeChoices
from api_company.filters import ExperimentFilter, ExperimentVersionFilter, ExperimentEntryFilter, \
    ExperimentEntryVersionFilter
from api_company.serializers.experiment import ExperimentEntrySerializer, \
    ExperimentDetailSerializer, ExperimentUidSerializer
from api_company.serializers.experiment_entry_version import ExperimentEntryVersionSerializer
from api_company.serializers.experiment_version import ExperimentVersionSerializer
from authentication import permission
from api_company.models import Template, Column, Experiment, ExperimentData, ExperimentDropdown, ExperimentVersion, \
    ExperimentEntry, ExperimentEntryVersion
from api_company.serializers import ColumnSerializer, TemplateSerializer, ExperimentSerializer, \
    ExperimentDataSerializer, ExperimentDropdownSerializer, ExperimentWithDefaultSerializer
from authentication.utils import initial_authenticate
from ctrl.s3 import file_upload, move_file
from ctrl.uuid import generate_uuid
from authentication.models import User


class ExperimentDropdownView(APIView):

    def get(self, request):
        column_id = self.kwargs['pk']
        options = ExperimentDropdown.objects.filter(column_id=column_id).all()
        serializer = ExperimentDropdownSerializer(options, many=True)
        return serializer.data

    def post(self, request, *args, **kwargs):
        column_id = self.kwargs['pk']
        deleted_options = self.request.data['deleted_options']
        options = self.request.data['options']
        ExperimentDropdown.objects.filter(pk__in=deleted_options).delete()
        for option in options:
            if 'id' not in option:
                ExperimentDropdown.objects.create(
                    column_id=column_id,
                    value=option['value']
                )
        options = ExperimentDropdown.objects.filter(column_id=column_id).all()
        serializer = ExperimentDropdownSerializer(options, many=True)
        return Response(serializer.data)


class ExperimentTemplateView(APIView):

    def get(self, request):
        templates = Template.objects.all()
        templates_serializer = TemplateSerializer(templates, many=True)
        return Response(templates_serializer.data)

    def post(self, request):
        db_name = self.request.data['name']
        columns = self.request.data['columns']

        try:
            with transaction.atomic(using=settings.CURRENT_DB):
                save_point_obj = transaction.savepoint(using=settings.CURRENT_DB)
                template = Template.objects.create(name=db_name)
                template_serializer = TemplateSerializer(template)
                for column in columns:
                    column['template'] = template.id
                    column_serializer = ColumnSerializer(data=column)
                    column_serializer.is_valid(raise_exception=True)
                    column_serializer.save()
                transaction.savepoint_commit(save_point_obj, using=settings.CURRENT_DB)
        except BaseException as e:
            return Response(
                data={
                    'detail': 'a database error occurred when trying to create database',
                },
                status=HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response(template_serializer.data)

    def put(self, request):
        template = self.request.data['template']
        columns = self.request.data['columns']
        deleted_columns = self.request.data['deletedColumns']

        try:
            with transaction.atomic(using=settings.CURRENT_DB):
                save_point_obj = transaction.savepoint(using=settings.CURRENT_DB)
                origin_template = Template.objects.get(pk=template['id'])
                origin_template.name = template['name']
                origin_template.save()
                template_serializer = TemplateSerializer(origin_template)
                Column.objects.filter(pk__in=deleted_columns).delete()
                for column in columns:
                    if 'id' not in column:
                        column['template'] = origin_template.id
                        column_serializer = ColumnSerializer(data=column)
                        column_serializer.is_valid(raise_exception=True)
                        column_serializer.save()
                    else:
                        origin_column = Column.objects.get(pk=column['id'])
                        column_serializer = ColumnSerializer(origin_column, column)
                        column_serializer.is_valid(raise_exception=True)
                        column_serializer.save()
                transaction.savepoint_commit(save_point_obj, using=settings.CURRENT_DB)
        except BaseException as e:
            return Response(
                data={
                    'detail': 'a database error occurred when trying to create database',
                },
                status=HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response(template_serializer.data)


class ColumnView(APIView):

    def get(self, request, *args, **kwargs):
        template_id = self.kwargs['pk']
        columns = Column.objects.filter(template_id=template_id).order_by('order').all()
        columns_serializer = ColumnSerializer(columns, many=True)
        return Response(columns_serializer.data)


class RecentExperimentDataView(APIView):

    def get(self, request, *args, **kwargs):
        user = self.request.user
        experiments = Experiment.objects.filter(user_id=user.id).order_by('-created_at').all()
        recent_exps = experiments[: 6]
        serializer = ExperimentWithDefaultSerializer(recent_exps, many=True)
        return Response(serializer.data)


class ExperimentDataView(APIView):

    def get(self, request, *args, **kwargs):
        user = self.request.user
        template_id = self.kwargs['pk']
        filter = None
        per_page = 100
        page = 1
        if self.request.query_params:
            filter = json.loads(self.request.query_params['filter'])
            per_page = self.request.query_params['per_page']
            page = int(self.request.query_params['page']) + 1
        columns = Column.objects.filter(template_id=template_id).order_by('order').all()
        columns_serializer = ColumnSerializer(columns, many=True)

        if filter:
            column = filter['column']
            if user.user_role == User.ROLE_REGULAR_USER:
                query = ExperimentData.objects.filter(experiment__template=template_id,
                                                      experiment__user_id=user.id,
                                                      column=column)
            else:
                users = User.objects.using('default').filter(company_uid=user.company.uid).all()
                ids = []
                for user in users:
                    ids.append(user.id)
                query = ExperimentData.objects.filter(experiment__template=template_id,
                                                      experiment__user_id__in=ids,
                                                      column=column)
            if 'searchText' in filter:
                filter_mode = filter['filterMode']
                value = filter['searchText']
                if filter_mode == 'equal':
                    query = query.filter(value=value)
                if filter_mode == 'does_not_equal':
                    query = query.exclude(value=value)
                if filter_mode == 'begins_with':
                    query = query.filter(value__startswith=value)
                if filter_mode == 'does_not_begins_with':
                    query = query.exlude(value__startswith=value)
                if filter_mode == 'end_with':
                    query = query.filter(value__endswith=value)
                if filter_mode == 'does_not_end_with':
                    query = query.exlude(value__endswith=value)
                if filter_mode == 'contains':
                    query = query.filter(value__contains=value)
                if filter_mode == 'does_not_contain':
                    query = query.exclude(value__contains=value)
            if 'filterDate' in filter:
                value = filter['filterDate']
                query = query.filter(value=value)
            if 'sortMode' in filter:
                query = query.order_by(filter['sortMode'])
            count = query.values('experiment').count()
            experiment_ids = query.values('experiment').all()
            paginator = Paginator(experiment_ids, per_page)
            page_obj = paginator.get_page(page)
            experiments = []
            for exp_id in page_obj:
                experiment = Experiment.objects.get(pk=exp_id['experiment'])
                experiments.append(experiment)
        else:
            query = Experiment.objects.filter(template=template_id, user_id=user.id).order_by('-id')
            #
            # if user.user_role == User.ROLE_REGULAR_USER:
            #     query = Experiment.objects.filter(template=template_id, user_id=user.id).order_by('-id')
            # else:
            #     users = User.objects.using('default').filter(company_uid=user.company.uid).all()
            #     ids = []
            #     for user in users:
            #         ids.append(user.id)
            #     query = Experiment.objects.filter(template=template_id, user_id__in=ids).order_by('-id')
            count = query.count()
            paginator = Paginator(query.all(), per_page)
            experiments = paginator.get_page(page)
        experiments_serializer = ExperimentSerializer(experiments, many=True)
        response_data = {
            'columns': columns_serializer.data,
            'exp_data': experiments_serializer.data,
            'count': count
        }
        return Response(response_data)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        user = self.request.user
        template = self.kwargs['pk']
        data = self.request.data
        try:
            save_point_obj = transaction.savepoint(using=settings.CURRENT_DB)
            experiment = Experiment.objects.create(
                template_id=template,
                user_id=user.id
            )
            experiment.uid = generate_uuid(user, experiment)
            experiment.save()
            experiment.create_data_folder()

            # Create Experiment Version
            ExperimentVersion.objects.create(
                experiment=experiment,
                description='Created'
            )

            experiment_serializer = ExperimentSerializer(experiment)
            for experiment_data in data:
                # encoded_value = data[experiment_data].encode('utf-8')
                exp_data = {
                    'value': data[experiment_data],
                    'column': experiment_data,
                    'experiment': experiment.id
                }
                experiment_data_serializer = ExperimentDataSerializer(data=exp_data)
                experiment_data_serializer.is_valid(raise_exception=True)
                experiment_data_serializer.save()
            transaction.savepoint_commit(save_point_obj, using=settings.CURRENT_DB)
        except BaseException as e:
            transaction.savepoint_rollback(save_point_obj, using=settings.CURRENT_DB)
            return Response(
                data={
                    'detail': 'a database error occurred when trying to create new experiment',
                },
                status=HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response(experiment_serializer.data)

    @transaction.atomic
    def put(self, request, *args, **kwargs):
        experiment_id = self.kwargs['pk']
        user = self.request.user
        data = self.request.data
        try:
            save_point_obj = transaction.savepoint(using=settings.CURRENT_DB)
            experiment = Experiment.objects.get(pk=experiment_id)
            for experiment_data in data:
                exp_data = ExperimentData.objects.filter(experiment=experiment, column_id=experiment_data).first()
                if exp_data:
                    exp_data.value = data[experiment_data]
                    exp_data.save()
                else:
                    exp_data = {
                        'value': data[experiment_data],
                        'column': experiment_data,
                        'experiment': experiment.id
                    }
                    experiment_data_serializer = ExperimentDataSerializer(data=exp_data)
                    experiment_data_serializer.is_valid(raise_exception=True)
                    experiment_data_serializer.save()
            experiment_serializer = ExperimentSerializer(experiment)
            transaction.savepoint_commit(save_point_obj, using=settings.CURRENT_DB)
        except BaseException as e:
            transaction.savepoint_rollback(save_point_obj, using=settings.CURRENT_DB)
            return Response(
                data={
                    'detail': 'a database error occurred when trying to create new experiment',
                },
                status=HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response(experiment_serializer.data)

    def delete(self, request, *args, **kwargs):
        experiment_id = self.kwargs['pk']
        experiment = Experiment.objects.get(pk=experiment_id)
        experiment.status = Experiment.STATUS_CLOSE
        experiment.save()
        return Response()


class ExperimentViewSet(mixins.ListModelMixin,
                        mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        viewsets.GenericViewSet):
    queryset = Experiment.objects.all()
    filter_class = ExperimentFilter
    ordering = ['-created_at', ]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ExperimentDetailSerializer
        return ExperimentSerializer

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        experiment = self.get_object()
        old_data = ExperimentDetailSerializer(experiment, context={"request": request}).data['entries']
        data = json.loads(request.data.get('data'))
        files = request.FILES.getlist('files[]')

        # Check update for version
        updated = False
        if len(old_data) != len(data):
            updated = True
        else:
            for i in range(len(old_data)):
                for key in old_data[i]:
                    if old_data[i][key] != data[i][key]:
                        updated = True
        try:
            save_point_obj = transaction.savepoint(using=settings.CURRENT_DB)
            if updated:
                exp_version = ExperimentVersion.objects.create(experiment=experiment, description='Updated')
                for item in data:
                    item_id = item.get('id', None)
                    if item.get('type') == ExperimentEntryTypeChoices.IMAGE.name:
                        if item_id is None:
                            # Upload to S3 bucket
                            object, file_key = experiment.image_bucket_object
                            _, b64data = item.get('file_source').split(',')
                            object.put(Body=base64.b64decode(b64data))
                            item['data'] = file_key

                    if item.get('type') == ExperimentEntryTypeChoices.FILE.name:
                        if item_id is None:
                            for file in files:
                                if file.name == item.get('data'):
                                    file_upload(file, request.user.company.bucket_name,
                                                experiment.data_folder_key + '/' + file.name)
                                    item['data'] = experiment.data_folder_key + '/' + file.name
                    ExperimentEntryVersion.objects.create(
                        experiment_version=exp_version,
                        data=item.get('data'),
                        type=item.get('type'),
                        order=item.get('order'),
                        row=item.get('row'),
                        column=item.get('column'),
                    )

            ExperimentEntry.objects.filter(experiment=experiment).delete()
            for item in data:
                item_id = item.get('id', None)
                if item.get('type') == ExperimentEntryTypeChoices.IMAGE.name:
                    if item_id is None:
                        # Upload to S3 bucket
                        object, file_key = experiment.image_bucket_object
                        _, b64data = item.get('file_source').split(',')
                        object.put(Body=base64.b64decode(b64data))
                        item['data'] = file_key

                if item.get('type') == ExperimentEntryTypeChoices.FILE.name:
                    if item_id is None:
                        for file in files:
                            if file.name == item.get('data'):
                                file_upload(file, request.user.company.bucket_name,
                                            experiment.data_folder_key + '/' + file.name)
                                item['data'] = experiment.data_folder_key + '/' + file.name
                ExperimentEntry.objects.create(
                    experiment=experiment,
                    data=item.get('data'),
                    type=item.get('type'),
                    order=item.get('order'),
                    row=item.get('row'),
                    column=item.get('column'),
                    created_at=item.get('created_at')
                )
        except BaseException as e:
            transaction.savepoint_rollback(save_point_obj, using=settings.CURRENT_DB)
            return Response(
                data={
                    'detail': 'a database error occurred when trying to update experiment entries',
                },
                status=HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response(True)


class ExperimentVersionViewSet(mixins.ListModelMixin,
                               viewsets.GenericViewSet):
    serializer_class = ExperimentVersionSerializer
    queryset = ExperimentVersion.objects.all()
    filter_class = ExperimentVersionFilter


class ExperimentEntryViewSet(mixins.ListModelMixin,
                             mixins.DestroyModelMixin,
                             viewsets.GenericViewSet):
    serializer_class = ExperimentEntrySerializer
    queryset = ExperimentEntry.objects.all()
    filter_class = ExperimentEntryFilter
    ordering = ['order', ]


class ExperimentEntryVersionViewSet(mixins.ListModelMixin,
                                    viewsets.GenericViewSet):
    serializer_class = ExperimentEntryVersionSerializer
    queryset = ExperimentEntryVersion.objects.all()
    filter_class = ExperimentEntryVersionFilter
    ordering = ['order', ]


class ExperimentSignView(APIView):
    def post(self, request):
        data = request.data
        user = initial_authenticate(initials=data['typeInitials'], password=data['password'])
        if user is not None:
            experiment = Experiment.objects.get(pk=data['expId'])
            experiment.sign_date = datetime.datetime.now()
            experiment.signed_user = user.id
            experiment.save()
        else:
            return Response(
                data={
                    'detail': 'Initials or password is incorrect. Please try again.',
                },
                status=HTTP_401_UNAUTHORIZED
            )
        return Response(data={'detail': 'Thank you. You signed off experiment!'})


class ExperimentAssignUserView(generics.UpdateAPIView):
    serializer_class = ExperimentSerializer
    queryset = Experiment.objects.all()

    def update(self, request, *args, **kwargs):
        experiment = self.get_object()
        experiment.assigned_user = request.data['assigned_user']
        experiment.save()
        return Response(data={'detail': 'Thank you. Experiment is assigned successfully!'})


class ExperimentMobileListView(generics.ListAPIView):
    serializer_class = ExperimentUidSerializer
    queryset = Experiment.objects.all()
    ordering = ['-id', ]

    def get_queryset(self):
        return self.queryset.filter(user_id=self.request.user.id)


class ExperimentMobileUploadView(APIView):

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        source_bucket = request.user.company.bucket_name
        source_key = const.FOLDER_STAGING_MOBILE + '/' + file.name
        try:
            file_upload(file, source_bucket, source_key)
        except BaseException:
            return Response({
                'detail': 'Error while uploading file.',
            })

        # Perform some actions before go to final destination

        copy_source = {
            'Bucket': source_bucket,
            'Key': source_key
        }
        destination = request.data.get('destination')
        if destination == 'LANDING':
            destination_key = "%s/private/%s/%s" % (request.user.folder_name, const.FOLDER_LANDING, file.name)
        else:
            destination_key = "%s/private/%s/%s/%s" % (
                request.user.folder_name, const.FOLDER_EXPERIMENT, destination, file.name
            )
        try:
            move_file(copy_source, source_bucket, destination_key)
            return Response({
                'detail': 'File is uploaded successfully.',
            })
        except BaseException:
            return Response({
                'detail': 'Error while moving file to final destination.',
            })
