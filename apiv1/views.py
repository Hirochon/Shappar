from django.shortcuts import get_object_or_404
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django_filters import rest_framework as filters
from django.http import HttpResponseNotFound
import uuid

from django.contrib.auth import get_user_model
from .models import Poll, Post, Option
from .serializers import MypageSerializer, PostCreateSerializer, PostListSerializer, PollSerializer, OptionSerializer

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

        if 10 < len(data['options']):
            return HttpResponseNotFound('<h1>Bad Request!</h1>')

        share_uuid = uuid.uuid4()
        data['share_id'] = share_uuid
        for datas in data['options']:
            datas['share_id'] = share_uuid

        user = get_object_or_404(get_user_model(), id=data['unique_id'])
        data['user'] = user.id
        del data['unique_id']

        serializer = PostCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)

class PostFilter(filters.FilterSet):
    """投稿表示用フィルタクラス"""

    class Meta:
        model = Post
        fields = '__all__'

class PostListAPIView(views.APIView):
    """投稿の取得(一覧)APIクラス"""

    def get(self, request, pk, *args, **kwargs):
        """投稿の取得(一覧)APIに対応するハンドラメソッド"""

        # モデルオブジェクトをクエリ文字列を使ってフィルタリングした結果を取得
        filterset = PostFilter(request.query_params, queryset=Post.objects.all().order_by('-created_at'))
        if not filterset.is_valid():
            raise ValidationError(filterset.errors)
        serializer = PostListSerializer(instance=filterset.qs, many=True, pk=pk)
        
        for datas in serializer.data:
            if not datas['voted']:
                total = 0
                for data in datas['options']:
                    total += data['votes']
                    data['votes'] = -1
                datas['total'] = total
            else:
                total = 0
                for data in datas['options']:
                    total += data['votes']
                datas['total'] = total
        return Response(serializer.data, status.HTTP_200_OK)

class PollCreateAPIView(views.APIView):
    """投票モデルの登録APIクラス"""

    def post(self, request, pk, *args, **kwargs):
        """投票時の登録APIに対応するハンドラメソッド"""

        data = request.data
        data['post'] = pk
        data['user'] = data['unique_id']
        del data['unique_id']

        data_option = data['option']
        del data['option']
        post = Post.objects.get(id=data['post'])
        options = Option.objects.filter(share_id=post.share_id)
        for option in options:
            if option.select_num == data_option['select_num']:
                option.votes += 1
                data_option['votes'] = option.votes
                data_option['share_id'] = option.share_id
                data_option['id'] = option.id
                data_option['answer'] = option.answer
                break
        serializer_option = OptionSerializer(instance=Option.objects.get(id=data_option['id']) ,data=data_option)
        serializer_option.is_valid(raise_exception=True)
        serializer_option.save()
        serializer = PollSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        seri_response = serializer_option.data
        del seri_response['share_id']
        del seri_response['answer']
        return Response(seri_response, status.HTTP_201_CREATED)