# Generated by Django 2.1.3 on 2020-09-29 15:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api_company', '0055_auto_20200929_1536'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cellstatushistory',
            name='cell_line_row',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api_company.CellLineRow'),
        ),
    ]
