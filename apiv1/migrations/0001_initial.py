# Generated by Django 2.2.10 on 2020-02-15 16:05

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
            name='Post',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='投稿ID')),
                ('question', models.TextField(max_length=150, verbose_name='質問文')),
                ('answer_1', models.CharField(max_length=15, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='選択肢1')),
                ('answer_2', models.CharField(blank=True, max_length=15, null=True, verbose_name='選択肢2')),
                ('answer_3', models.CharField(blank=True, max_length=15, null=True, verbose_name='選択肢3')),
                ('answer_4', models.CharField(blank=True, max_length=15, null=True, verbose_name='選択肢4')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='post_user', to=settings.AUTH_USER_MODEL, verbose_name='ユーザ')),
            ],
            options={
                'db_table': 'post',
            },
        ),
        migrations.CreateModel(
            name='Poll',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('voted', models.BooleanField(default=False, verbose_name='投稿したかどうか')),
                ('total', models.IntegerField(default=0, verbose_name='合計投票数')),
                ('select', models.IntegerField(verbose_name='投票先')),
                ('num_1', models.IntegerField(default=0, verbose_name='小計1')),
                ('num_2', models.IntegerField(default=0, verbose_name='小計2')),
                ('num_3', models.IntegerField(default=0, verbose_name='小計3')),
                ('num_4', models.IntegerField(default=0, verbose_name='小計4')),
                ('post', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='poll_post', to='apiv1.Post', verbose_name='投稿')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='poll_user', to=settings.AUTH_USER_MODEL, verbose_name='投票者')),
            ],
            options={
                'db_table': 'poll',
            },
        ),
    ]
