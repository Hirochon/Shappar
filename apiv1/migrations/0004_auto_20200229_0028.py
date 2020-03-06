# Generated by Django 2.2.10 on 2020-02-28 15:28

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apiv1', '0003_auto_20200228_2349'),
    ]

    operations = [
        migrations.AlterField(
            model_name='option',
            name='answer',
            field=models.CharField(max_length=16, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='選択肢'),
        ),
    ]
