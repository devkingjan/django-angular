# Generated by Django 2.1.3 on 2020-09-28 19:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0053_celllinecurrentstatus'),
    ]

    operations = [
        migrations.AddField(
            model_name='celllinecurrentstatus',
            name='origin_passage_number',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='cellstatushistory',
            name='cell_line_current_status',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api_company.CellLineCurrentStatus'),
        ),
    ]
