import json
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
from api_company.models import StorageTemperature, StorageEquipment, StorageLocation, InventoryDatabase, \
    InventorySampleLocation
from api_company.serializers import StorageTemperatureSerializer, StorageEquipmentSerializer, \
    StorageLocationSerializer, InventoryDatabaseWithTemperatureSerializer, StorageEquipmentWithBoxSerializer, \
    InventorySampleLocationSerializer, InventorySamplesByLocationSerializer


class StorageTemperatureView(generics.ListCreateAPIView):
    serializer_class = StorageTemperatureSerializer

    def get_queryset(self):
        queryset = StorageTemperature.objects
        if self.request.query_params:
            filter = json.loads(self.request.query_params['filter'])
            database = filter['database']
            storage_temperatures = StorageLocation.objects.filter(database_id=database).values('storage_temperature')
            queryset = queryset.filter(pk__in=storage_temperatures)
        return queryset


class StorageEquipmentView(generics.ListCreateAPIView):
    queryset = StorageEquipment.objects.all()
    serializer_class = StorageEquipmentSerializer


class StorageLocationView(APIView):

    def get(self, request, *args, **kwargs):
        if self.request.query_params:
            query_filter = json.loads(self.request.query_params['filter'])
            pk = query_filter['id']
            location = StorageLocation.objects.get(pk=pk)
            location_serializer = StorageLocationSerializer(location)
        else:
            locations = StorageLocation.objects.all()
            location_serializer = StorageLocationSerializer(locations, many=True)
        return Response(location_serializer.data)

    def post(self, request):
        check_location = StorageLocation.objects.filter(
            database=self.request.data['database'],
            storage_temperature=self.request.data['storage_temperature'],
            equipment=self.request.data['equipment'],
            allocate_tower=self.request.data['allocate_tower'],
            storage_type=self.request.data['storage_type'],
            allocate_number=self.request.data['allocate_number']
        ).first()
        if check_location:
            return Response(data={'details': 'Same location exists already, Please try again'},
                            status=HTTP_400_BAD_REQUEST)
        location_serializer = StorageLocationSerializer(data=self.request.data)
        location_serializer.is_valid(raise_exception=True)
        location_serializer.save()
        inventory_databases = InventoryDatabase.objects.filter(pk__in=StorageLocation.objects.values('database'))
        inventory_database_serializer = InventoryDatabaseWithTemperatureSerializer(inventory_databases, many=True)
        return Response(inventory_database_serializer.data)

    def put(self, request, *args, **kwargs):
        location_id = self.kwargs['pk']
        check_location = StorageLocation.objects.filter(
            database=self.request.data['database'],
            storage_temperature=self.request.data['storage_temperature'],
            equipment=self.request.data['equipment'],
            allocate_tower=self.request.data['allocate_tower'],
            storage_type=self.request.data['storage_type'],
            allocate_number=self.request.data['allocate_number']
        ).exclude(pk=location_id).first()
        if check_location:
            return Response(data={'details': 'Same location exists already, Please try again'},
                            status=HTTP_400_BAD_REQUEST)
        location = StorageLocation.objects.get(pk=location_id)
        location_serializer = StorageLocationSerializer(location, self.request.data)
        location_serializer.is_valid(raise_exception=True)
        location_serializer.save()
        inventory_databases = InventoryDatabase.objects.filter(pk__in=StorageLocation.objects.values('database'))
        inventory_database_serializer = InventoryDatabaseWithTemperatureSerializer(inventory_databases, many=True)
        return Response(inventory_database_serializer.data)

    def delete(self, request, *args, **kwargs):
        location_id = self.kwargs['pk']
        StorageLocation.objects.get(pk=location_id).delete()
        inventory_databases = InventoryDatabase.objects.filter(pk__in=StorageLocation.objects.values('database'))
        inventory_database_serializer = InventoryDatabaseWithTemperatureSerializer(inventory_databases, many=True)
        return Response(inventory_database_serializer.data)


class StorageLocationValidateView(APIView):
    def post(self, request):
        location = InventorySampleLocation.objects.filter(location=self.request.data['id'], position=self.request.data['position'])
        valid = True
        if location:
            valid = False
        return Response({'valid': valid})


class StorageLocationByTemperatureView(APIView):

    def get(self, request):
        inventory_databases = InventoryDatabase.objects.filter(pk__in=StorageLocation.objects.values('database'))
        inventory_database_serializer = InventoryDatabaseWithTemperatureSerializer(inventory_databases, many=True)
        return Response(inventory_database_serializer.data)


class EquipmentWithBoxView(APIView):

    def get(self, request, *args, **kwargs):
        if not self.request.query_params:
            return Response([])
        query_filter = json.loads(self.request.query_params['filter'])
        database = query_filter['database']
        storage_temperature = query_filter['storage_temperature']
        query = StorageLocation.objects.filter(database_id=database, storage_temperature_id=storage_temperature)
        equipments = StorageEquipment.objects.filter(pk__in=query.values('equipment'))
        serializer = StorageEquipmentWithBoxSerializer(equipments, many=True, context={'query_filter': query_filter})
        return Response(serializer.data)


class SampleByLocationView(APIView):
    def get(self, request, *args, **kwargs):
        location_id = self.kwargs['pk']
        samples = InventorySampleLocation.objects.filter(location_id=location_id).all()
        serializer = InventorySamplesByLocationSerializer(samples, many=True)
        return Response(serializer.data)
