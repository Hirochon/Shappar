import uuid
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.validators import MinValueValidator,MaxValueValidator,MaxLengthValidator
from django.db import models

def get_iconimage_path(instance, filename):
    return 'images/{0}/iconimage/{1}'.format(instance.id, filename)

class CustomUser(AbstractUser):
    """拡張ユーザーモデル"""

    class Meta(AbstractUser.Meta):
        db_table = 'user'
    
    id = models.UUIDField(verbose_name='ユーザID',primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(verbose_name='メールアドレス', unique=True)
    username = models.CharField(verbose_name='ユーザID', unique=True, max_length=18)
    usernonamae = models.CharField(verbose_name='ユーザ名', max_length=18)
    choice_site = (("0","女"),("1","男"),("2","その他"),("3","無回答"))
    sex = models.CharField(verbose_name='性別', max_length=6, choices=choice_site)
    age = models.IntegerField(verbose_name='年齢', default=0, validators=[MinValueValidator(0),MaxValueValidator(150)])
    born_at = models.DateField(verbose_name='生年月日', blank=True, null=True)
    iconimage = models.ImageField(verbose_name='ユーザアイコン', blank=True, null=True, upload_to=get_iconimage_path)
    created_at = models.DateTimeField(default=timezone.now, editable=False)


    def __str__(self):
        return self.usernonamae