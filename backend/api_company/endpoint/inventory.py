import json
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from django.core.paginator import Paginator
from rest_framework.status import HTTP_500_INTERNAL_SERVER_ERROR, HTTP_400_BAD_REQUEST
from api_company.models import InventoryDatabase, InventoryColumn, InventorySample, InventorySampleData, \
    StorageLocation, InventorySampleLocation, InventoryDropdown
from api_company.serializers import InventoryDatabaseSerializer, InventoryColumnSerializer, \
    InventorySampleSerializer, InventorySampleDataSerializer, InventorySampleLocationSerializer, InventoryDropdownSerializer


class InventoryDropdownView(APIView):

    def get(self, request):
        column_id = self.kwargs['pk']
        options = InventoryDropdown.objects.filter(column_id=column_id).all()
        serializer = InventoryDropdownSerializer(options, many=True)
        return serializer.data

    def post(self, request, *args, **kwargs):
        column_id = self.kwargs['pk']
        deleted_options = self.request.data['deleted_options']
        options = self.request.data['options']
        InventoryDropdown.objects.filter(pk__in=deleted_options).delete()
        for option in options:
            if 'id' not in option:
                InventoryDropdown.objects.create(
                    column_id=column_id,
                    value=option['value']
                )
        options = InventoryDropdown.objects.filter(column_id=column_id).all()
        serializer = InventoryDropdownSerializer(options, many=True)
        return Response(serializer.data)


class InventoryDatabaseView(APIView):

    def get(self, request):
        inventories = InventoryDatabase.objects.all()
        inventories_serializer = InventoryDatabaseSerializer(inventories, many=True)
        return Response(inventories_serializer.data)

    def post(self, request):
        db_name = self.request.data['name']
        columns = self.request.data['columns']

        try:
            with transaction.atomic(using='company'):
                save_point_obj = transaction.savepoint(using='company')
                inventory = InventoryDatabase.objects.create(name=db_name)
                inventory_serializer = InventoryDatabaseSerializer(inventory)
                for column in columns:
                    column['database'] = inventory.id
                    column_serializer = InventoryColumnSerializer(data=column)
                    column_serializer.is_valid(raise_exception=True)
                    column_serializer.save()
                transaction.savepoint_commit(save_point_obj, using='company')
        except BaseException as e:
            return Response(
                data={
                    'detail': 'a database error occurred when trying to create database',
                },
                status=HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response(inventory_serializer.data)

    def put(self, request):
        database = self.request.data['template']
        columns = self.request.data['columns']
        deleted_columns = self.request.data['deletedColumns']

        try:
            with transaction.atomic(using='company'):
                save_point_obj = transaction.savepoint(using='company')
                origin_inventory_database = InventoryDatabase.objects.get(pk=database['id'])
                origin_inventory_database.name = database['name']
                origin_inventory_database.save()
                template_serializer = InventoryDatabaseSerializer(origin_inventory_database)
                InventoryColumn.objects.filter(pk__in=deleted_columns).delete()
                for column in columns:
                    if 'id' not in column:
                        column['database'] = origin_inventory_database.id
                        column_serializer = InventoryColumnSerializer(data=column)
                        column_serializer.is_valid(raise_exception=True)
                        column_serializer.save()
                    else:
                        origin_column = InventoryColumn.objects.get(pk=column['id'])
                        column_serializer = InventoryColumnSerializer(origin_column, column)
                        column_serializer.is_valid(raise_exception=True)
                        column_serializer.save()
                transaction.savepoint_commit(save_point_obj, using='company')
        except BaseException as e:
            print(e)
            return Response(
                data={
                    'detail': 'a database error occurred when trying to create database',
                },
                status=HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response(template_serializer.data)


class InventoryColumnView(APIView):

    def get(self, request, *args, **kwargs):
        database_id = self.kwargs['pk']
        columns = InventoryColumn.objects.filter(database_id=database_id).order_by('order').all()
        columns_serializer = InventoryColumnSerializer(columns, many=True)
        return Response(columns_serializer.data)


class InventorySampleDataView(APIView):
    database_id = None
    filter = None
    per_page = 100
    page = 1

    def get(self, request, *args, **kwargs):
        self.database_id = self.kwargs['pk']
        if self.request.query_params:
            self.filter = json.loads(self.request.query_params['filter'])
            self.per_page = self.request.query_params['per_page']
            self.page = int(self.request.query_params['page']) + 1
        columns = InventoryColumn.objects.filter(database_id=self.database_id).order_by('order').all()
        columns_serializer = InventoryColumnSerializer(columns, many=True)
        if self.filter:
            default = self.filter['default']
            if default:
                column = self.filter['column']
                if column == 'Temperature':
                    count, samples = self.filter_by_temperature()
                elif column == 'Equipment':
                    count, samples = self.filter_by_equipment()
                elif column == 'Tower':
                    count, samples = self.filter_by_tower()
                elif column == 'Shelf':
                    count, samples = self.filter_by_shelf()
                elif column == 'Box #':
                    count, samples = self.filter_by_box()
            else:
                count, samples = self.filter_by_normal_field()
        else:
            query = InventorySample.objects.filter(database_id=self.database_id).order_by('-created_at')
            count = query.count()
            paginator = Paginator(query.all(), self.per_page)
            samples = paginator.get_page(self.page)
        inventory_samples_serializer = InventorySampleSerializer(samples, many=True)
        response_data = {
            'columns': columns_serializer.data,
            'sample_data': inventory_samples_serializer.data,
            'count': count
        }
        return Response(response_data)

    def filter_by_normal_field(self):
        column = self.filter['column']
        query = InventorySampleData.objects.filter(inventory_sample__database=self.database_id, column=column)
        if 'searchText' in self.filter:
            filter_mode = self.filter['filterMode']
            value = self.filter['searchText']
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
        if 'filterDate' in self.filter:
            value = self.filter['filterDate']
            query = query.filter(value=value)
        if 'sortMode' in self.filter:
            query = query.order_by(self.filter['sortMode'])
        count = query.values('inventory_sample').count()
        sample_ids = query.values('inventory_sample').all()
        paginator = Paginator(sample_ids, self.per_page)
        page_obj = paginator.get_page(self.page)
        samples = []
        for exp_id in page_obj:
            sample = InventorySample.objects.get(pk=exp_id['inventory_sample'])
            samples.append(sample)
        if not len(samples):
            return 0, []
        return count, samples

    def filter_by_temperature(self):
        query = InventorySampleLocation.objects.filter(sample__database=self.database_id)
        if 'searchText' in self.filter:
            filter_mode = self.filter['filterMode']
            value = self.filter['searchText']
            if filter_mode == 'equal':
                query = query.filter(location__storage_temperature__name=value)
            if filter_mode == 'does_not_equal':
                query = query.exclude(location__storage_temperature__name=value)
            if filter_mode == 'begins_with':
                query = query.filter(location__storage_temperature__name__startswith=value)
            if filter_mode == 'does_not_begins_with':
                query = query.exlude(location__storage_temperature__name__startswith=value)
            if filter_mode == 'end_with':
                query = query.filter(location__storage_temperature__name__endswith=value)
            if filter_mode == 'does_not_end_with':
                query = query.exlude(location__storage_temperature__name__endswith=value)
            if filter_mode == 'contains':
                query = query.filter(location__storage_temperature__name__contains=value)
            if filter_mode == 'does_not_contain':
                query = query.exclude(location__storage_temperature__name__contains=value)
        if 'sortMode' in self.filter:
            if self.filter['sortMode'] == 'value':
                self.filter['sortMode'] = False
            else:
                self.filter['sortMode'] = True

            query = sorted(query, key=lambda i: i.location.storage_temperature.name, reverse=self.filter['sortMode'])
            count = len(query)
            paginator = Paginator(query, self.per_page)
            page_obj = paginator.get_page(self.page)
            samples = []
            for exp_id in page_obj:
                samples.append(exp_id.sample)
        else:
            count = query.values('sample').count()
            sample_ids = query.values('sample').all()
            paginator = Paginator(sample_ids, self.per_page)
            page_obj = paginator.get_page(self.page)
            samples = []
            for exp_id in page_obj:
                sample = InventorySample.objects.get(pk=exp_id['sample'])
                samples.append(sample)
        return count, samples

    def filter_by_equipment(self):
        query = InventorySampleLocation.objects.filter(sample__database=self.database_id)
        if 'searchText' in self.filter:
            filter_mode = self.filter['filterMode']
            value = self.filter['searchText']
            if filter_mode == 'equal':
                query = query.filter(location__equipment__name=value)
            if filter_mode == 'does_not_equal':
                query = query.exclude(location__equipment__name=value)
            if filter_mode == 'begins_with':
                query = query.filter(location__equipment__name__startswith=value)
            if filter_mode == 'does_not_begins_with':
                query = query.exlude(location__equipment__name__startswith=value)
            if filter_mode == 'end_with':
                query = query.filter(location__equipment__name__endswith=value)
            if filter_mode == 'does_not_end_with':
                query = query.exlude(location__equipment__name__endswith=value)
            if filter_mode == 'contains':
                query = query.filter(location__equipment__name__contains=value)
            if filter_mode == 'does_not_contain':
                query = query.exclude(location__equipment__name__contains=value)
        if 'sortMode' in self.filter:
            if self.filter['sortMode'] == 'value':
                self.filter['sortMode'] = False
            else:
                self.filter['sortMode'] = True

            query = sorted(query, key=lambda i: i.location.equipment.name, reverse=self.filter['sortMode'])
            count = len(query)
            paginator = Paginator(query, self.per_page)
            page_obj = paginator.get_page(self.page)
            samples = []
            for exp_id in page_obj:
                samples.append(exp_id.sample)
        else:
            count = query.values('sample').count()
            sample_ids = query.values('sample').all()
            paginator = Paginator(sample_ids, self.per_page)
            page_obj = paginator.get_page(self.page)
            samples = []
            for exp_id in page_obj:
                sample = InventorySample.objects.get(pk=exp_id['sample'])
                samples.append(sample)
        return count, samples

    def filter_by_tower(self):
        query = InventorySampleLocation.objects.filter(sample__database=self.database_id)
        if 'searchText' in self.filter:
            filter_mode = self.filter['filterMode']
            value = self.filter['searchText']
            if filter_mode == 'equal':
                query = query.filter(location__allocate_tower=value)
            if filter_mode == 'does_not_equal':
                query = query.exclude(location__allocate_tower=value)
            if filter_mode == 'begins_with':
                query = query.filter(location__allocate_tower__startswith=value)
            if filter_mode == 'does_not_begins_with':
                query = query.exlude(location__allocate_tower__startswith=value)
            if filter_mode == 'end_with':
                query = query.filter(location__allocate_tower__endswith=value)
            if filter_mode == 'does_not_end_with':
                query = query.exlude(location__allocate_tower__endswith=value)
            if filter_mode == 'contains':
                query = query.filter(location__allocate_tower__contains=value)
            if filter_mode == 'does_not_contain':
                query = query.exclude(location__allocate_tower__contains=value)
        if 'sortMode' in self.filter:
            if self.filter['sortMode'] == 'value':
                self.filter['sortMode'] = False
            else:
                self.filter['sortMode'] = True

            query = sorted(query, key=lambda i: i.location.allocate_tower, reverse=self.filter['sortMode'])
            count = len(query)
            paginator = Paginator(query, self.per_page)
            page_obj = paginator.get_page(self.page)
            samples = []
            for exp_id in page_obj:
                samples.append(exp_id.sample)
        else:
            count = query.values('sample').count()
            sample_ids = query.values('sample').all()
            paginator = Paginator(sample_ids, self.per_page)
            page_obj = paginator.get_page(self.page)
            samples = []
            for exp_id in page_obj:
                sample = InventorySample.objects.get(pk=exp_id['sample'])
                samples.append(sample)
        return count, samples

    def filter_by_shelf(self):
        query = InventorySampleLocation.objects.filter(sample__database=self.database_id)
        if 'searchText' in self.filter:
            filter_mode = self.filter['filterMode']
            value = self.filter['searchText']
            if filter_mode == 'equal':
                query = query.filter(location__storage_type='shelf', location__allocate_number=value)
            if filter_mode == 'does_not_equal':
                query = query.exclude(location__storage_type='shelf', location__allocate_number=value)
            if filter_mode == 'begins_with':
                query = query.filter(location__storage_type='shelf', location__allocate_number__startswith=value)
            if filter_mode == 'does_not_begins_with':
                query = query.exlude(location__storage_type='shelf', location__allocate_number__startswith=value)
            if filter_mode == 'end_with':
                query = query.filter(location__storage_type='shelf', location__allocate_number__endswith=value)
            if filter_mode == 'does_not_end_with':
                query = query.exlude(location__storage_type='shelf', location__allocate_number__endswith=value)
            if filter_mode == 'contains':
                query = query.filter(location__storage_type='shelf', location__allocate_number__contains=value)
            if filter_mode == 'does_not_contain':
                query = query.exclude(location__storage_type='shelf', location__allocate_number__contains=value)
        if 'sortMode' in self.filter:
            if self.filter['sortMode'] == 'value':
                self.filter['sortMode'] = False
            else:
                self.filter['sortMode'] = True

            query = sorted(query, key=lambda i: i.location.allocate_number, reverse=self.filter['sortMode'])
            count = len(query)
            paginator = Paginator(query, self.per_page)
            page_obj = paginator.get_page(self.page)
            samples = []
            for exp_id in page_obj:
                samples.append(exp_id.sample)
        else:
            count = query.values('sample').count()
            sample_ids = query.values('sample').all()
            paginator = Paginator(sample_ids, self.per_page)
            page_obj = paginator.get_page(self.page)
            samples = []
            for exp_id in page_obj:
                sample = InventorySample.objects.get(pk=exp_id['sample'])
                samples.append(sample)
        return count, samples

    def filter_by_box(self):
        query = InventorySampleLocation.objects.filter(sample__database=self.database_id)
        if 'searchText' in self.filter:
            filter_mode = self.filter['filterMode']
            value = self.filter['searchText']
            if filter_mode == 'equal':
                query = query.filter(location__storage_type='box', location__allocate_number=value)
            if filter_mode == 'does_not_equal':
                query = query.exclude(location__storage_type='box', location__allocate_number=value)
            if filter_mode == 'begins_with':
                query = query.filter(location__storage_type='box', location__allocate_number__startswith=value)
            if filter_mode == 'does_not_begins_with':
                query = query.exlude(location__storage_type='box', location__allocate_number__startswith=value)
            if filter_mode == 'end_with':
                query = query.filter(location__storage_type='box', location__allocate_number__endswith=value)
            if filter_mode == 'does_not_end_with':
                query = query.exlude(location__storage_type='box', location__allocate_number__endswith=value)
            if filter_mode == 'contains':
                query = query.filter(location__storage_type='box', location__allocate_number__contains=value)
            if filter_mode == 'does_not_contain':
                query = query.exclude(location__storage_type='box', location__allocate_number__contains=value)
        if 'sortMode' in self.filter:
            if self.filter['sortMode'] == 'value':
                self.filter['sortMode'] = False
            else:
                self.filter['sortMode'] = True

            query = sorted(query, key=lambda i: i.location.allocate_number, reverse=self.filter['sortMode'])
            count = len(query)
            paginator = Paginator(query, self.per_page)
            page_obj = paginator.get_page(self.page)
            samples = []
            for exp_id in page_obj:
                samples.append(exp_id.sample)
        else:
            count = query.values('sample').count()
            sample_ids = query.values('sample').all()
            paginator = Paginator(sample_ids, self.per_page)
            page_obj = paginator.get_page(self.page)
            samples = []
            for exp_id in page_obj:
                sample = InventorySample.objects.get(pk=exp_id['sample'])
                samples.append(sample)
        return count, samples

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        user = self.request.user
        database = self.kwargs['pk']
        data = self.request.data
        sample_data_list = data['sample_data']
        locations = data['locations']
        try:
            save_point_obj = transaction.savepoint(using='company')
            samples = []
            for location in locations:

                check_location = InventorySampleLocation.objects.filter(location_id=location['id']).first()

                if check_location and check_location.location.storage_type == StorageLocation.STORAGE_TYPE_BOX:
                    if check_location.position == location['position']:
                        return Response(
                            data={
                                'detail': 'Same location exist already, Please select another location',
                            },
                            status=HTTP_400_BAD_REQUEST
                        )

                sample = InventorySample.objects.create(
                    database_id=database,
                    user_id=user.id
                )
                location_entity = StorageLocation.objects.get(pk=location['id'])
                sample.uid = "%s%s%s-%s-%s-%s" % (location_entity.storage_temperature.name[0], location_entity.equipment.name[0],
                                              location_entity.storage_type[0], location_entity.allocate_number,
                                              location['position'], sample.id)
                sample.save()
                samples.insert(0, sample)

                sample_location = {
                    'sample': sample.id,
                    'location': location['id'],
                    'position': location['position']
                }
                sample_location_serializer = InventorySampleLocationSerializer(data=sample_location)
                sample_location_serializer.is_valid(raise_exception=True)
                sample_location_serializer.save()

                for column in sample_data_list:
                    sample_data = {
                        'value': sample_data_list[column],
                        'column': column,
                        'inventory_sample': sample.id
                    }
                    sample_data_serializer = InventorySampleDataSerializer(data=sample_data)
                    sample_data_serializer.is_valid(raise_exception=True)
                    sample_data_serializer.save()

            samples_serializer = InventorySampleSerializer(samples, many=True)
            transaction.savepoint_commit(save_point_obj, using='company')
        except BaseException as e:
            print(e)
            transaction.savepoint_rollback(save_point_obj, using='company')
            return Response(
                data={
                    'detail': 'a database error occurred when trying to create new experiment',
                },
                status=HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response(samples_serializer.data)

    @transaction.atomic
    def put(self, request, *args, **kwargs):
        sample_id = self.kwargs['pk']
        sample_location_id = self.kwargs['sl']
        user = self.request.user
        data = self.request.data
        sample_data_list = data['sample_data']
        location = data['locations'][0]
        try:
            save_point_obj = transaction.savepoint(using='company')
            sample = InventorySample.objects.get(pk=sample_id)

            origin_sample_location = InventorySampleLocation.objects.get(pk=sample_location_id)
            sample_location = {
                'sample': sample.id,
                'location': location['id'],
                'position': location.get('position', None)
            }
            sample_location_serializer = InventorySampleLocationSerializer(origin_sample_location, sample_location)
            sample_location_serializer.is_valid(raise_exception=True)
            sample_location_serializer.save()
            for column in sample_data_list:
                sample_data = InventorySampleData.objects.filter(inventory_sample=sample, column_id=column).first()
                if sample_data:
                    sample_data.value = sample_data_list[column]
                    sample_data.save()
                else:
                    sample_data = {
                        'value': sample_data_list[column],
                        'column': column,
                        'inventory_sample': sample.id
                    }
                    sample_data_serializer = InventorySampleDataSerializer(data=sample_data)
                    sample_data_serializer.is_valid(raise_exception=True)
                    sample_data_serializer.save()
            sample_serializer = InventorySampleSerializer(sample)
            transaction.savepoint_commit(save_point_obj, using='company')
        except BaseException as e:
            print(e)
            transaction.savepoint_rollback(save_point_obj, using='company')
            return Response(
                data={
                    'detail': 'a database error occurred when trying to create new experiment',
                },
                status=HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response(sample_serializer.data)

    def delete(self, request, *args, **kwargs):
        sample_id = self.kwargs['pk']
        sample = InventorySample.objects.get(pk=sample_id)
        InventorySampleLocation.objects.filter(sample=sample).delete()
        sample.status = InventorySample.STATUS_CLOSE
        sample.user_id = self.request.user.id
        sample.save()
        sample_serializer = InventorySampleSerializer(sample)
        return Response(sample_serializer.data)
