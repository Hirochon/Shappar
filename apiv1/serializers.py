from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Mypage, Post

class MypageSerializer(serializers.ModelSerializer):
    """マイページ用シリアライザ"""

    unique_id = serializers.ReadOnlyField(source='user.id')
    user_id = serializers.CharField(source='user.username')
    name = serializers.CharField(source='user.usernonamae')
    iconimage = serializers.ImageField(source='user.iconimage')

    class Meta:
        model = Mypage
        fields = ['unique_id','user_id','name','introduction','iconimage','homeimage']

class PostSerializer(serializers.ModelSerializer):
    """投稿用のシリアライザ"""

    user_id = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = Post
        fields = ['id','user_id']