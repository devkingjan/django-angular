from django.contrib import admin
from api_company import models


@admin.register(models.Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'uid', 'company_uid', 'avatar', 'status', 'created_at', 'updated_at')


@admin.register(models.MemberPermission)
class MemberPermissionAdmin(admin.ModelAdmin):
    list_display = ('member', 'permission_id')


@admin.register(models.LabAccessMember)
class MemberPermissionAdmin(admin.ModelAdmin):
    list_display = ('me', 'member')


@admin.register(models.Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(models.Column)
class ColumnAdmin(admin.ModelAdmin):
    list_display = ('name', 'widget', 'order', 'template')


@admin.register(models.Experiment)
class ExperimentAdmin(admin.ModelAdmin):
    list_display = ('uid', 'template', 'user_id', 'created_at', 'updated_at')


@admin.register(models.ExperimentData)
class ExperimentDataAdmin(admin.ModelAdmin):
    list_display = ('value', 'column', 'experiment')


@admin.register(models.InventoryDatabase)
class InventoryDatabaseAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(models.InventoryColumn)
class InventoryColumnAdmin(admin.ModelAdmin):
    list_display = ('name', 'widget', 'default', 'order', 'database')


@admin.register(models.InventoryDropdown)
class InventoryDropdownAdmin(admin.ModelAdmin):
    list_display = ('column', 'value' )


@admin.register(models.StorageTemperature)
class StorageTemperatureAdmin(admin.ModelAdmin):
    list_display = ('name', )


@admin.register(models.StorageEquipment)
class StorageEquipmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_tower', 'tower_number')


@admin.register(models.StorageLocation)
class StorageLocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'database', 'storage_temperature', 'equipment', 'allocate_tower', 'storage_type',
                    'allocate_number', 'vertical_number', 'horizontal_number', 'define_location')


@admin.register(models.InventorySample)
class InventorySampleAdmin(admin.ModelAdmin):
    list_display = ('uid', 'database', 'status', 'user_id', 'updated_at', 'created_at')


@admin.register(models.InventorySampleData)
class InventorySampleDataAdmin(admin.ModelAdmin):
    list_display = ('value', 'column', 'inventory_sample')


@admin.register(models.InventorySampleLocation)
class InventorySampleLocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'sample', 'location', 'position')


@admin.register(models.CalendarEvent)
class CalendarEventAdmin(admin.ModelAdmin):
    list_display = ('start', 'end', 'title', 'allDay', 'draggable')


@admin.register(models.TaskList)
class TaskListAdmin(admin.ModelAdmin):
    list_display = ('name', 'user_id', 'updated_at', 'created_at')


@admin.register(models.Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'user_id', 'due_date', 'task_list', 'updated_at', 'created_at')


@admin.register(models.CellCultureLine)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'uid', 'name', 'origin', 'generic_modification', 'how_started', 'date_taken', 'passage_number',
                  'culture_medium', 'medium_additive', 'mycoplasmas_state', 'culture_property', 'note', 'user_id',
                  'updated_at', 'created_at',)


@admin.register(models.CellCultureEvent)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'selected_date', 'log_type', 'remove_reason', 'note', 'mycoplasma_type',
                    'medium_additive_text', 'reason_other', 'cell_culture_line', 'updated_at', 'created_at')
