# Generated by Django 2.1.3 on 2020-08-06 18:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0012_experiment_user_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='InventoryColumn',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=400, null=True)),
                ('widget', models.CharField(blank=True, choices=[('text', 'text'), ('number', 'number'), ('date', 'date'), ('dropdown', 'dropdown')], max_length=400, null=True)),
                ('order', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'inventory_columns',
            },
        ),
        migrations.CreateModel(
            name='InventoryDatabase',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=400, null=True)),
            ],
            options={
                'db_table': 'inventory_database',
            },
        ),
        migrations.AlterField(
            model_name='experiment',
            name='status',
            field=models.IntegerField(choices=[(0, 'pending'), (1, 'close')], default=0),
        ),
        migrations.AddField(
            model_name='inventorycolumn',
            name='database',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api_company.InventoryDatabase'),
        ),
    ]
