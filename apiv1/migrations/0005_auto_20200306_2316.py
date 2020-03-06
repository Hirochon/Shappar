# Generated by Django 2.2.10 on 2020-03-06 14:16

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apiv1', '0004_auto_20200229_0028'),
    ]

    operations = [
        migrations.AlterField(
            model_name='option',
            name='answer',
            field=models.CharField(max_length=40, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='選択肢'),
        ),
    ]
