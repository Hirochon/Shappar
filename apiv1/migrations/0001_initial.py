# Generated by Django 2.2.10 on 2020-05-08 07:15

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Option',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('select_num', models.IntegerField(verbose_name='選択肢に対応する番号')),
                ('answer', models.CharField(max_length=40, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='選択肢')),
                ('votes', models.IntegerField(default=0, verbose_name='投票数')),
                ('share_id', models.UUIDField(verbose_name='選択肢共通ID')),
            ],
            options={
                'db_table': 'option',
            },
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='投稿ID')),
                ('question', models.TextField(max_length=150, verbose_name='質問文')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, editable=False, verbose_name='投稿日時')),
                ('share_id', models.UUIDField(verbose_name='選択肢共通ID')),
                ('total', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)], verbose_name='合計投票数')),
                ('options', models.ManyToManyField(blank=True, to='apiv1.Option', verbose_name='選択肢モデル')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='post_user', to=settings.AUTH_USER_MODEL, verbose_name='ユーザ')),
            ],
            options={
                'db_table': 'post',
            },
        ),
        migrations.CreateModel(
            name='Poll',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, editable=False, verbose_name='投票日時')),
                ('option', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='poll_option', to='apiv1.Option', verbose_name='選択肢ID')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='poll_post', to='apiv1.Post', verbose_name='投稿モデル')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='poll_user', to=settings.AUTH_USER_MODEL, verbose_name='投票者')),
            ],
            options={
                'db_table': 'poll',
            },
        ),
    ]
