# Generated by Django 2.1.3 on 2020-08-07 17:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0016_storageequipment'),
    ]

    operations = [
        migrations.CreateModel(
            name='StorageLocation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('storage_type', models.CharField(blank=True, choices=[('box', 'box'), ('tower', 'tower'), ('shelf', 'shelf')], max_length=400, null=True)),
                ('allocate_number', models.CharField(blank=True, max_length=400, null=True)),
                ('vertical_number', models.IntegerField()),
                ('horizontal_number', models.IntegerField()),
                ('define_location', models.CharField(blank=True, choices=[('by_running_numbers', 'By Running Number'), ('by_letter_number', 'By Letter and Number')], max_length=400, null=True)),
                ('database', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_company.InventoryDatabase')),
                ('equipment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_company.StorageEquipment')),
                ('storage_temperature', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_company.StorageTemperature')),
            ],
            options={
                'db_table': 'storage_location',
            },
        ),
    ]
