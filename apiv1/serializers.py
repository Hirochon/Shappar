from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post, Poll

class MypageSerializer(serializers.ModelSerializer):
    """マイページ用シリアライザ"""

    unique_id = serializers.ReadOnlyField(source='id')
    user_id = serializers.CharField(source='username')
    name = serializers.CharField(source='usernonamae')

    class Meta:
        model = get_user_model()
        fields = ['unique_id', 'user_id', 'name', 'introduction', 'iconimage', 'homeimage']


class PostSerializer(serializers.ModelSerializer):
    """投稿用のシリアライザ"""

    post_id = serializers.ReadOnlyField(source='id')
    unique_id = serializers.ReadOnlyField(source='user.id')
    user_id = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Post
        fields = ['post_id', 'unique_id', 'user_id', 'question', 'answer_1', 'answer_2', 'answer_3', 'answer_4']


class PollSerializer(serializers.ModelSerializer):
    """投票用のシリアライザ"""

    post_id = serializers.ReadOnlyField(source='post.id')
    unique_id = serializers.ReadOnlyField(source='user.id')
    user_id = serializers.ReadOnlyField(source='user.username')
    iconimage = serializers.ImageField(source='user.iconimage')

    class Meta:
        model = Poll
        fields = ['id', 'post_id', 'unique_id', 'user_id', 'iconimage', 'voted', 'total', 'select', 'num_1', 'num_2', 'num_3', 'num_4']