from rest_framework import serializers
from api_company.models import StorageEquipment, StorageLocation


class StorageEquipmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = StorageEquipment
        fields = ('__all__')


class StorageEquipmentWithBoxSerializer(serializers.ModelSerializer):

    allocate_numbers = serializers.SerializerMethodField()
    allocate_towers = serializers.SerializerMethodField()

    class Meta:
        model = StorageEquipment
        fields = ('id', 'name', 'is_tower', 'tower_number', 'allocate_numbers', 'allocate_towers')

    def get_allocate_numbers(self, obj):
        if obj.is_tower:
            return []
        query_filter = self.context['query_filter']
        database = query_filter['database']
        storage_temperature = query_filter['storage_temperature']
        allocate_numbers = StorageLocation.objects.filter(database_id=database,
                                                          storage_temperature_id=storage_temperature,
                                                          equipment=obj)\
            .values('allocate_number', 'vertical_number', 'horizontal_number', 'define_location', 'storage_type', 'id').all()
        return allocate_numbers

    def get_allocate_towers(self, obj):
        if not obj.is_tower:
            return []
        query_filter = self.context['query_filter']
        database = query_filter['database']
        storage_temperature = query_filter['storage_temperature']
        allocate_towers = StorageLocation.objects.filter(database_id=database,
                                                         storage_temperature_id=storage_temperature,
                                                         equipment=obj).values('allocate_tower').all()
        # remove duplicated element
        allocate_towers = [i for n, i in enumerate(allocate_towers) if i not in allocate_towers[n + 1:]]
        for allocate_tower in allocate_towers:
            allocate_numbers = StorageLocation.objects.filter(database_id=database,
                                                              storage_temperature_id=storage_temperature,
                                                              allocate_tower=allocate_tower['allocate_tower'],
                                                              equipment=obj)\
                .values('allocate_number', 'vertical_number', 'horizontal_number', 'define_location', 'storage_type', 'id').all()
            allocate_tower['allocate_numbers'] = allocate_numbers
        return allocate_towers

