from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post, Poll, Option

class MypageSerializer(serializers.ModelSerializer):
    """マイページ用シリアライザ"""

    user_id = serializers.CharField(source='username')
    name = serializers.CharField(source='usernonamae')

    class Meta:
        model = get_user_model()
        fields = ['user_id', 'name', 'introduction', 'iconimage', 'homeimage']


class OptionSerializer(serializers.ModelSerializer):
    """選択肢用シリアライザ"""

    class Meta:
        model = Option
        fields = ['id','select_num', 'answer', 'votes', 'share_id']


class OptionListSerializer(serializers.ListSerializer):
    child = OptionSerializer()


class PostCreateSerializer(serializers.ModelSerializer):
    """投稿用シリアライザ"""
    options = OptionListSerializer()

    class Meta:
        model = Post
        fields = ['user', 'question', 'options', 'share_id']

    def create(self, validated_data):
        options = []
        for option_data in validated_data.pop('options'):
            options.append(Option.objects.create(**option_data))
        post = super().create(validated_data)
        post.options.set(options)
        return post


class PostListSerializer(serializers.ModelSerializer):
    """投稿一覧取得シリアライザ"""

    def __init__(self, pk, instance):
        super().__init__(instance)
        self.pk = pk

    post_id = serializers.ReadOnlyField(source='id')
    user_id = serializers.ReadOnlyField(source='user.username')
    iconimage = serializers.ImageField(source='user.iconimage')
    created_at = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S.%fZ')

    voted = serializers.SerializerMethodField()
    options = OptionListSerializer()

    class Meta:
        model = Post
        fields = ['post_id', 'user_id', 'iconimage', 'question', 'voted', 'options', 'created_at']

    def get_voted(self, instance):
        if Poll.objects.filter(user_id=self.pk,post_id=instance.id):
            return True
        if Post.objects.filter(user_id=self.pk,id=instance.id):
            return True
        else:
            return False

class PostDetailSerializer(serializers.ModelSerializer):
    """投票済みユーザーの情報取得シリアライザ"""

    class Meta:
        model = get_user_model()
        fields = ['sex','age','born_at']


class PollSerializer(serializers.ModelSerializer):
    """投票用シリアライザ"""

    class Meta:
        model = Poll
        fields = ['post','user','option']

    def validate(self, data):
        """同じ投稿への複数投票&投稿本人の投票阻止バリデーションメソッド"""
        user = data.get('user')
        post = data.get('post')

        poll = Poll.objects.filter(user_id=user.id,post_id=post.id)
        if len(poll) > 0:
            raise serializers.ValidationError("同じ投稿への投票は一度のみです。")

        post = Post.objects.filter(id=post.id,user_id=user.id)
        if len(post) > 0:
            raise serializers.ValidationError("投稿した本人は投票はできません。")
        
        return data