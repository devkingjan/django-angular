# Generated by Django 2.1.3 on 2020-09-23 10:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0042_cellcultureevent'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cellcultureevent',
            name='cell_culture_line',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='events', to='api_company.CellCultureLine'),
        ),
        migrations.AlterField(
            model_name='cellcultureline',
            name='passage_number',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
