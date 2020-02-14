from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post

class MypageSerializer(serializers.ModelSerializer):
    """マイページ用シリアライザ"""

    unique_id = serializers.ReadOnlyField(source='id')
    user_id = serializers.ReadOnlyField(source='username')
    name = serializers.ReadOnlyField(source='usernonamae')

    class Meta:
        model = get_user_model()
        fields = ['unique_id', 'user_id', 'name', 'introduction', 'iconimage', 'homeimage']
        

class PostSerializer(serializers.ModelSerializer):
    """投稿用のシリアライザ"""

    user_id = serializers.ReadOnlyField(source='id')

    class Meta:
        model = Post
        fields = ['id','user_id']