from rest_framework import serializers
from api_company.models import Experiment, Column, ExperimentDropdown, ExperimentVersion, ExperimentEntry
from api_company.serializers import ExperimentDataSerializer
from api_company.serializers.experiment_entry import ExperimentEntrySerializer
from authentication.models import User
from authentication.serializers import UserSerializer


class ExperimentSerializer(serializers.ModelSerializer):

    data_folder = serializers.SerializerMethodField()

    def get_data_folder(self, obj):
        return obj.data_folder_key

    column_data = serializers.SerializerMethodField()

    def get_column_data(self, obj):
        exp_data = obj.exp_data.all()
        exp_data_serializer = ExperimentDataSerializer(exp_data, many=True)
        return exp_data_serializer.data

    signed_user_info = serializers.SerializerMethodField()

    def get_signed_user_info(self, obj):
        if obj.signed_user:
            user = User.objects.get(pk=obj.signed_user)
            serializer = UserSerializer(user)
            return serializer.data
        else:
            return {}

    assigned_user_info = serializers.SerializerMethodField()

    def get_assigned_user_info(self, obj):
        if obj.assigned_user:
            user = User.objects.get(pk=obj.assigned_user)
            serializer = UserSerializer(user)
            return serializer.data
        else:
            return {}

    class Meta:
        model = Experiment
        fields = (
            'id',
            'uid',
            'status',
            'created_at',
            'column_data',
            'data_folder',
            'sign_date',
            'signed_user',
            'signed_user_info',
            'assigned_user',
            'assigned_user_info',
            'template',
            'updated_at',
            'created_at'
        )


class ExperimentWithDefaultSerializer(serializers.ModelSerializer):

    data_folder = serializers.SerializerMethodField()

    def get_data_folder(self, obj):
        return obj.data_folder_key

    default_data = serializers.SerializerMethodField()

    def get_default_data(self, obj):
        default = {}
        exp_data = obj.exp_data.filter(column__default=True).all()
        for data in exp_data:
            if data.column.widget == Column.WIDGET_DROPDOWN:
                option = ExperimentDropdown.objects.get(pk=data.value)
                if not option:
                    default[data.column.name] = None
                default[data.column.name] = option.value
            else:
                default[data.column.name] = data.value
        return default

    class Meta:
        model = Experiment
        fields = ('id', 'uid', 'status', 'created_at', 'template', 'default_data', 'data_folder', 'updated_at', 'created_at')


class ExperimentDetailSerializer(serializers.ModelSerializer):
    entries = ExperimentEntrySerializer(many=True, source="experimententry_set")
    column_data = serializers.SerializerMethodField()

    def get_column_data(self, obj):
        exp_data = obj.exp_data.all()
        exp_data_serializer = ExperimentDataSerializer(exp_data, many=True)
        return exp_data_serializer.data

    class Meta:
        model = Experiment
        fields = ('id', 'entries', 'column_data')


class ExperimentUidSerializer(serializers.ModelSerializer):

    class Meta:
        model = Experiment
        fields = ('uid', )
