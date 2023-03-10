# Generated by Django 2.1.3 on 2020-08-18 03:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0027_auto_20200813_1657'),
    ]

    operations = [
        migrations.CreateModel(
            name='InventoryDropdown',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(blank=True, max_length=400, null=True)),
                ('column', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_company.InventoryColumn')),
            ],
            options={
                'db_table': 'inventory_dropdown',
            },
        ),
    ]
