import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.validators import MinLengthValidator,MaxValueValidator,MinValueValidator 


class Post(models.Model):
    """投稿モデル"""

    class Meta:
        db_table = 'post'

    id = models.UUIDField(verbose_name='投稿ID',primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(get_user_model(), verbose_name='ユーザ', on_delete=models.PROTECT, related_name='post_user')
    question = models.TextField(verbose_name='質問文', max_length=150, blank=False, null=False)
    answer_1 = models.CharField(verbose_name='選択肢1', max_length=15, validators=[MinLengthValidator(1)])
    answer_2 = models.CharField(verbose_name='選択肢2', blank=True, null=True, max_length=15)
    answer_3 = models.CharField(verbose_name='選択肢3', blank=True, null=True, max_length=15)
    answer_4 = models.CharField(verbose_name='選択肢4', blank=True, null=True, max_length=15)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self):
        return '投稿者: ' + self.user.usernonamae + '(' + self.user.username + ') 質問: ' + self.question


class Poll(models.Model):
    """投票モデル"""
    
    class Meta:
        db_table = 'poll'

    post = models.ForeignKey(Post, verbose_name='投稿', on_delete=models.PROTECT, related_name='poll_post')
    user = models.ForeignKey(get_user_model(), verbose_name='投票者', on_delete=models.PROTECT, related_name='poll_user')
    voted = models.BooleanField(verbose_name='投稿したかどうか', default=False)
    total = models.IntegerField(verbose_name='合計投票数', default=0)
    select = models.IntegerField(verbose_name='投票先', blank=False, null=False, validators=[MinValueValidator(1),MaxValueValidator(4)])
    num_1 = models.IntegerField(verbose_name='小計1', default=0, validators=[MinValueValidator(0)])
    num_2 = models.IntegerField(verbose_name='小計2', default=0, validators=[MinValueValidator(0)])
    num_3 = models.IntegerField(verbose_name='小計3', default=0, validators=[MinValueValidator(0)])
    num_4 = models.IntegerField(verbose_name='小計4', default=0, validators=[MinValueValidator(0)])

    def __str__(self):
        return self.user.usernonamae + "(" + self.user.username + ") 質問:" + self.post.question + " (投票先:" + str(self.select) + ")"