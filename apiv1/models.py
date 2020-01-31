from django.db import models
from django.contrib.auth import get_user_model

def get_favorite_image_path(instance, filename):
    return 'images/fav/{0}/{1}'.format(instance.submitter.id, filename)

class Mypage(models.Model):
    """マイページ"""

    class Meta:
        db_table = 'mypage'

    user = models.ForeignKey(get_user_model(), verbose_name='ユーザ', on_delete=models.CASCADE, related_name='mypage_user')
    intro = models.CharField(verbose_name='自己紹介', max_length=150, blank=True, null=True)
    homeimage = models.ImageField(verbose_name='ホーム画像', blank=True, null=True, upload_to=get_favorite_image_path)

    def __str__(self):
        return self.user.usernonamae