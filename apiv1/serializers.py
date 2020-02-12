from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Mypage

class MypageSerializer(serializers.ModelSerializer):
    """マイページ用シリアライザ"""

    user_id = serializers.ReadOnlyField(source='user.id')
    username = serializers.CharField(source='user.username')
    usernonamae = serializers.CharField(source='user.usernonamae')
    iconimage = serializers.ImageField(source='user.iconimage')

    class Meta:
        model = Mypage
        fields = ['user_id','username','usernonamae','introduction','iconimage','homeimage']