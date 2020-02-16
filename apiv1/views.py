from django.shortcuts import get_object_or_404
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django_filters import rest_framework as filters

from django.contrib.auth import get_user_model
from .models import Poll
from .serializers import MypageSerializer, PostSerializer, PollSerializer

class MypageAPIView(views.APIView):
    """マイページ用APIクラス"""

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

class PostCreateAPIView(views.APIView):
    """投稿用APIクラス"""

    def post(self, request, *args, **kwargs):
        """投稿時の登録APIに対応するハンドラメソッド"""

        serializer = PostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)

class PollFilter(filters.FilterSet):
    """投票用フィルタクラス"""

    class Meta:
        model = Poll
        fields = '__all__'

class PollCreateAPIView(views.APIView):
    """投票モデルの取得(一覧)・登録APIクラス"""

    def post(self, request, pk, qk, *args, **kwargs):
        """投票時の登録APIに対応するハンドラメソッド"""

        serializer = PollSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        """投票モデルの取得(一覧)APIに対応する"""

        # モデルオブジェクトをクエリ文字列を使ってフィルタリングした結果を取得
        filterset = PollFilter(request.query_params, queryset=Poll.objects.all())
        if not filterset.is_valid():
            raise ValidationError(filterset.errors)
        serializer = PollSerializer(instance=filterset.qs, many=True)
        return Response(serializer.data, status.HTTP_200_OK)