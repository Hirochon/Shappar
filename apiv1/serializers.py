from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post, Poll, Option

class MypageSerializer(serializers.ModelSerializer):
    """マイページ用シリアライザ"""

    unique_id = serializers.ReadOnlyField(source='id')
    user_id = serializers.CharField(source='username')
    name = serializers.CharField(source='usernonamae')

    class Meta:
        model = get_user_model()
        fields = ['unique_id', 'user_id', 'name', 'introduction', 'iconimage', 'homeimage']


class OptionSerializer(serializers.ModelSerializer):
    """選択肢用シリアライザ"""

    class Meta:
        model = Option
        fields = ['select_num', 'answer', 'share_id']


class PostCreateSerializer(serializers.ModelSerializer):
    """投稿用シリアライザ"""

    class Meta:
        model = Post
        fields = ['user', 'question','share_id']


class PostListSerializer(serializers.ModelSerializer):
    """投稿一覧取得シリアライザ"""

    post_id = serializers.ReadOnlyField(source='id')
    user_id = serializers.ReadOnlyField(source='user.username')
    iconimage = serializers.ImageField(source='user.iconimage')
    created_at = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S.%fZ')

    class Meta:
        model = Post
        fields = ['post_id', 'user_id', 'iconimage', 'question', 'answer_1', 'answer_2', 'answer_3', 'answer_4', 'created_at']


class PollSerializer(serializers.ModelSerializer):
    """投票用シリアライザ"""

    post_id = serializers.ReadOnlyField(source='post.id')
    user_id = serializers.ReadOnlyField(source='user.username')
    iconimage = serializers.ImageField(source='user.iconimage')

    class Meta:
        model = Poll
        fields = ['id','post_id', 'unique_id', 'user_id', 'iconimage', 'voted']