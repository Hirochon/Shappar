# Generated by Django 2.2.10 on 2020-02-18 21:54

import accounts.models
import django.contrib.auth.models
import django.core.validators
from django.db import migrations, models
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=30, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ユーザID')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='メールアドレス')),
                ('username', models.CharField(max_length=18, unique=True, verbose_name='ユーザID')),
                ('usernonamae', models.CharField(max_length=18, verbose_name='ユーザ名')),
                ('sex', models.CharField(choices=[('0', '女'), ('1', '男'), ('2', 'その他'), ('3', '無回答')], max_length=6, verbose_name='性別')),
                ('age', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(150)], verbose_name='年齢')),
                ('born_at', models.DateField(blank=True, null=True, verbose_name='生年月日')),
                ('introduction', models.TextField(blank=True, max_length=150, null=True, verbose_name='自己紹介')),
                ('iconimage', models.ImageField(blank=True, default='images/customuser/iconimage/icon.png', null=True, upload_to=accounts.models.get_iconimage_path, verbose_name='アイコン画像')),
                ('homeimage', models.ImageField(blank=True, default='images/customuser/homeimage/home.jpg', null=True, upload_to=accounts.models.get_homeimage_path, verbose_name='ホーム画像')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'db_table': 'user',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
    ]
