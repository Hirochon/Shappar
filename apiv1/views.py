from django.shortcuts import get_object_or_404
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django_filters import rest_framework as filters

from django.contrib.auth import get_user_model
from .models import Poll, Post
from .serializers import MypageSerializer, PostSerializer, PollSerializer

class MypageAPIView(views.APIView):
    """マイページ用詳細・更新・一部更新APIクラス"""

    def get(self, request, pk, *args, **kwargs):
        """マイページモデルの取得APIに対応するハンドラメソッド"""

        """エンドポイントをユーザIDによってマイページを取得する場合"""
        mypage = get_object_or_404(get_user_model(), username=pk)

        # """エンドポイントをUUIDによってマイページを取得する場合"""
        # mypage = get_object_or_404(Mypage, user_id=pk)

        serializer = MypageSerializer(instance=mypage)
        return Response(serializer.data, status.HTTP_200_OK)

    def put(self, request, pk, *args, **kwargs):
        """マイページモデルの更新APIに対応するハンドラメソッド"""

        mypage = get_object_or_404(get_user_model(), username=pk)
        serializer = MypageSerializer(instance=mypage, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_200_OK)

    def patch(self, request, pk, *args, **kwargs):
        """マイページモデルの一部更新APIに対応するハンドラメソッド"""

        mypage = get_object_or_404(get_user_model(), username=pk)
        serializer = MypageSerializer(instance=mypage, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_200_OK)

class PostCreateAPIView(views.APIView):
    """投稿用APIクラス"""

    def post(self, request, *args, **kwargs):
        """投稿時の登録APIに対応するハンドラメソッド"""

        data = request.data
        user = get_object_or_404(get_user_model(), id=data['unique_id'])
        post = {}
        post['user'] = user.id
        post['question'] = data['question']
        post['answer_1'] = data['answer_1']
        post['answer_2'] = data['answer_2']
        post['answer_3'] = data['answer_3']
        post['answer_4'] = data['answer_4']
        serializer = PostSerializer(data=post)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)

class PostFilter(filters.FilterSet):
    """投稿表示用フィルタクラス"""

    class Meta:
        model = Post
        fields = '__all__'

class PollRetrieveAPIView(views.APIView):
    """投票モデルの取得(一覧)クラス"""

    def get(self, request, *args, **kwargs):
        """投票モデルの取得(一覧)APIに対応するハンドラメソッド"""

        # モデルオブジェクトをクエリ文字列を使ってフィルタリングした結果を取得
        filterset = PostFilter(request.query_params, queryset=Post.objects.all().order_by('-created_at'))
        if not filterset.is_valid():
            raise ValidationError(filterset.errors)
        serializer = PostSerializer(instance=filterset.qs, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

class PollCreateAPIView(views.APIView):
    """投票モデルの登録APIクラス"""

    def post(self, request, pk, qk, *args, **kwargs):
        """投票時の登録APIに対応するハンドラメソッド"""

        serializer = PollSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)