# Generated by Django 4.2.3 on 2023-09-04 04:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("workschedule", "0003_rename_hospname_hospital_name"),
    ]

    operations = [
        migrations.AlterField(
            model_name="hospital",
            name="name",
            field=models.CharField(max_length=100, verbose_name="病院名"),
        ),
    ]
