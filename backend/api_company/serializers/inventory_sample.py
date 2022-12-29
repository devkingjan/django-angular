from rest_framework import serializers
from api_company.models import InventorySample
from api_company.serializers import InventorySampleDataSerializer
from authentication.models import User


class InventorySampleSerializer(serializers.ModelSerializer):

    column_data = serializers.SerializerMethodField()

    def get_column_data(self, obj):
        sample_data = obj.sample_data.all()
        sample_data_serializer = InventorySampleDataSerializer(sample_data, many=True)
        return sample_data_serializer.data

    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        if not obj.user_id:
            return None
        user = User.objects.get(pk=obj.user_id)
        return user.initials

    location = serializers.SerializerMethodField()

    def get_location(self, obj):
        sample_location = obj.location.first()
        if not sample_location:
            return {
                'id': None,
                'storage_temperature': None,
                'sample_location_id': None,
                'position': None,
                'equipment': None,
                'Temperature': None,
                'Equipment': None,
                'Tower': 'Tower%s' % None,
                'Box #': '',
                'Shelf': ''
            }
        location = sample_location.location
        sample_position = sample_location.position
        if location.equipment.is_tower:
            position = '%s%s (%s)' % (location.storage_type, location.allocate_number, sample_position)
        else:
            position = '%s%s (%s)' % (location.storage_type, location.allocate_number,  sample_position)

        if location.storage_type == 'box':
            return {
                'id': location.id,
                'storage_temperature': location.storage_temperature.id,
                'equipment': location.equipment.id,
                'sample_location_id': sample_location.id,
                'position': sample_position,
                'Temperature': location.storage_temperature.name,
                'Equipment': location.equipment.name,
                'Tower': location.allocate_tower,
                'Box #': position,
                'Shelf': ''
            }
        elif location.storage_type == 'shelf':
            position = '%s%s' % (location.storage_type, location.allocate_number)
            return {
                'id': location.id,
                'storage_temperature': location.storage_temperature.id,
                'equipment': location.equipment.id,
                'sample_location_id': sample_location.id,
                'position': sample_position,
                'Temperature': location.storage_temperature.name,
                'Equipment': location.equipment.name,
                'Tower': location.allocate_tower,
                'Box #': '',
                'Shelf': position
            }
        else:
            return {
                'id': location.id,
                'storage_temperature': location.storage_temperature.id,
                'equipment': location.equipment.id,
                'sample_location_id': sample_location.id,
                'position': sample_position,
                'Temperature': location.storage_temperature.name,
                'Equipment': location.equipment.name,
                'Tower': location.allocate_tower,
                'Box #': '',
                'Shelf': ''
            }

    class Meta:
        model = InventorySample
        fields = ('id', 'uid', 'status', 'location', 'database', 'created_at', 'user', 'column_data', 'updated_at')

