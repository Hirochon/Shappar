from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

def get_homeimage_path(instance, filename):
    return 'images/{0}/homeimage/{1}'.format(instance.user.id, filename)

class Mypage(models.Model):
    """マイページモデル"""

    class Meta:
        db_table = 'mypage'
    
    user = models.OneToOneField(get_user_model(), verbose_name='ユーザ', unique=True, on_delete=models.CASCADE, related_name='mypage_user')
    introduction = models.CharField(verbose_name='自己紹介', max_length=150, blank=True, null=True)
    homeimage = models.ImageField(verbose_name='ホーム画像', blank=True, null=True, upload_to=get_homeimage_path)
    
    def __str__(self):
        return self.user.usernonamae