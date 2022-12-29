import django_filters.rest_framework as filters
from . import models


class EmptyFilter(filters.FilterSet):
    empty_value = 'EMPTY'
    due_date_field = filters.CharFilter(
        method='due_date_field_filter',
    )

    def due_date_field_filter(self, queryset, name, value):
        if value != self.empty_value:
            return super(EmptyFilter, self).filter(queryset, value)
        queryset = queryset.filter(due_date=None)
        return queryset

    class Meta:
        fields = '__all__'
        model = models.Task


class ExperimentFilter(filters.FilterSet):

    class Meta:
        model = models.Experiment
        fields = '__all__'


class ExperimentVersionFilter(filters.FilterSet):

    class Meta:
        model = models.ExperimentVersion
        fields = '__all__'


class ExperimentEntryFilter(filters.FilterSet):

    class Meta:
        model = models.ExperimentEntry
        fields = '__all__'


class ExperimentEntryVersionFilter(filters.FilterSet):

    class Meta:
        model = models.ExperimentEntryVersion
        fields = '__all__'
