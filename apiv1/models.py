import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.validators import MinLengthValidator,MaxValueValidator,MinValueValidator 

class Option(models.Model):
    """投稿・投票の選択肢モデル"""

    class Meta:
        db_table = 'option'

    select_num = models.IntegerField(verbose_name='選択肢に対応する番号')
    answer = models.CharField(verbose_name='選択肢', max_length=16, validators=[MinLengthValidator(1)])
    votes = models.IntegerField(verbose_name='投票数', default=0)
    share_id = models.UUIDField(verbose_name='選択肢共通ID')


class Post(models.Model):
    """投稿モデル"""

    class Meta:
        db_table = 'post'

    id = models.UUIDField(verbose_name='投稿ID',primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(get_user_model(), verbose_name='ユーザ', on_delete=models.CASCADE, related_name='post_user')
    question = models.TextField(verbose_name='質問文', max_length=150, blank=False, null=False)
    created_at = models.DateTimeField(verbose_name='投稿日時',default=timezone.now, editable=False)
    options = models.ManyToManyField(Option, verbose_name='選択肢モデル', blank=True)
    share_id = models.UUIDField(verbose_name='選択肢共通ID')

    def __str__(self):
        return '投稿者: ' + self.user.usernonamae + '(' + self.user.username + ') 質問: ' + self.question


class Poll(models.Model):
    """投票モデル"""
    
    class Meta:
        db_table = 'poll'

    post = models.ForeignKey(Post, verbose_name='投稿モデル', on_delete=models.CASCADE, related_name='poll_post')
    user = models.ForeignKey(get_user_model(), verbose_name='投票者', on_delete=models.CASCADE, related_name='poll_user')