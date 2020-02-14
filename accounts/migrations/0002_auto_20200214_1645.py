# Generated by Django 2.2.10 on 2020-02-14 07:45

import accounts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='homeimage',
            field=models.ImageField(blank=True, default='images/customuser/homeimage/home.jpg', null=True, upload_to=accounts.models.get_homeimage_path, verbose_name='ホーム画像'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='iconimage',
            field=models.ImageField(blank=True, default='images/customuser/iconimage/icon.png', null=True, upload_to=accounts.models.get_iconimage_path, verbose_name='アイコン画像'),
        ),
    ]
