# Generated by Django 2.2.9 on 2020-01-31 16:39

import accounts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_auto_20200126_2322'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='iconimage',
            field=models.ImageField(blank=True, null=True, upload_to=accounts.models.get_iconimage_path, verbose_name='ユーザアイコン'),
        ),
    ]
