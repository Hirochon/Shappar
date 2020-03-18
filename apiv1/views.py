from django.shortcuts import get_object_or_404
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters
from django.http import HttpResponseNotFound
import uuid

from django.contrib.auth import get_user_model
from .models import Poll, Post, Option
from .serializers import (
    MypageSerializer, 
    PostCreateSerializer, 
    PostListSerializer, 
    PollSerializer, 
    OptionSerializer,
    PostDetailSerializer,
)

def Response_unauthorized():
    return Response({"detail":"権限がありません"},status.HTTP_401_UNAUTHORIZED)

class MypageAPIView(views.APIView):
    """マイページ用詳細・更新・一部更新APIクラス"""

    def get(self, request, pk, *args, **kwargs):
        """マイページモデルの取得APIに対応するハンドラメソッド"""

        mypage = get_object_or_404(get_user_model(), username=pk)
        serializer = MypageSerializer(instance=mypage)
        return Response(serializer.data, status.HTTP_200_OK)

    def put(self, request, pk, *args, **kwargs):
        """マイページモデルの更新APIに対応するハンドラメソッド"""

        if request.user.username != pk:
            return Response_unauthorized()

        mypage = get_object_or_404(get_user_model(), username=pk)
        serializer = MypageSerializer(instance=mypage, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_200_OK)

    def patch(self, request, pk, *args, **kwargs):
        """マイページモデルの一部更新APIに対応するハンドラメソッド"""

        if request.user.username != pk:
            return Response_unauthorized()

        mypage = get_object_or_404(get_user_model(), username=pk)
        serializer = MypageSerializer(instance=mypage, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_200_OK)


class MypagePostedListAPIView(views.APIView):
    """マイページでの自分の投稿取得(一覧)"""

    def get(self, request, pk, *args, **kwargs):
        """自分の投稿取得(一覧)"""

        sk = get_user_model().objects.get(username=pk).id

        # 自身の投稿のみフィルタリング
        if 'pid' in request.GET:
            post_basis = Post.objects.get(id=request.GET['pid'])
            querysets = Post.objects.filter(user_id=sk, created_at__lt=post_basis.created_at).order_by('-created_at')[:10]
        else:
            querysets = Post.objects.filter(user_id=sk).order_by('-created_at')[:10]

        serializer = PostListSerializer(instance=querysets, many=True, pk=sk)

        for datas in serializer.data:
            if not datas['voted']:
                total = 0
                datas['selected_num'] = -1
                for data in datas['options']:
                    del data['id']
                    del data['share_id']
                    total += data['votes']
                    data['votes'] = -1
                datas['total'] = total
            else:
                total = 0
                for data in datas['options']:
                    flag = Poll.objects.filter(user_id=sk,option_id=data['id'])
                    if len(flag) > 0:
                        datas['selected_num'] = Option.objects.get(id=flag[0].option_id).select_num
                    else:
                        if not 'selected_num' in datas:
                            datas['selected_num'] = -1
                    del data['id']
                    del data['share_id']
                    total += data['votes']
                datas['total'] = total
        seri_datas = serializer.data

        response = {}
        response["posts"] = seri_datas
        return Response(response, status.HTTP_200_OK)


class MypageVotedListAPIView(views.APIView):
    """マイページでの自分の投票取得(一覧)"""

    def get(self, request, pk, *args, **kwargs):
        """自分の投票取得(一覧)"""

        sk = get_user_model().objects.get(username=pk).id

        # 自身の投票のみフィルタリング
        if 'pid' in request.GET:
            post_basis = Post.objects.get(id=request.GET['pid'])
            querysets = Post.objects.filter(poll_post__user__id=sk, created_at__lt=post_basis.created_at).order_by('-created_at')[:10]
        else:
            querysets = Post.objects.filter(poll_post__user__id=sk).order_by('-created_at')[:10]

        serializer = PostListSerializer(instance=querysets, many=True, pk=sk)

        for datas in serializer.data:
            if not datas['voted']:
                total = 0
                datas['selected_num'] = -1
                for data in datas['options']:
                    del data['id']
                    del data['share_id']
                    total += data['votes']
                    data['votes'] = -1
                datas['total'] = total
            else:
                total = 0
                for data in datas['options']:
                    flag = Poll.objects.filter(user_id=sk,option_id=data['id'])
                    if len(flag) > 0:
                        datas['selected_num'] = Option.objects.get(id=flag[0].option_id).select_num
                    else:
                        if not 'selected_num' in datas:
                            datas['selected_num'] = -1
                    del data['id']
                    del data['share_id']
                    total += data['votes']
                datas['total'] = total
        seri_datas = serializer.data

        response = {}
        response["posts"] = seri_datas
        return Response(response, status.HTTP_200_OK)


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

        for datas in serializer.data['options']:
            del datas['id']
            del datas['share_id']

        return Response(serializer.data, status.HTTP_201_CREATED)


class PostListAPIView(views.APIView):
    """投稿の取得(一覧)APIクラス"""

    def get(self, request, *args, **kwargs):
        """投稿の取得(一覧)APIに対応するハンドラメソッド"""

        # モデルオブジェクトをクエリ文字列を使ってフィルタリング
        if 'q' in request.GET:
            if 'pid' in request.GET:
                post_basis = Post.objects.get(id=request.GET['pid'])
                queryset = Post.objects.filter(created_at__lt=post_basis.created_at, question__contains=request.GET['q']).order_by('-created_at')[:10]
            else:
                queryset = Post.objects.filter(question__contains=request.GET['q']).order_by('-created_at')[:10]
        elif 'pid' in request.GET:
            post_basis = Post.objects.get(id=request.GET['pid'])
            queryset = Post.objects.filter(created_at__lt=post_basis.created_at).order_by('-created_at')[:10]
        else:
            queryset = Post.objects.all().order_by('-created_at')[:10]

        unique_id = request.user.id
        serializer = PostListSerializer(instance=queryset, many=True, pk=unique_id)

        for datas in serializer.data:
            if not datas['voted']:
                total = 0
                datas['selected_num'] = -1
                for data in datas['options']:
                    del data['id']
                    del data['share_id']
                    total += data['votes']
                    data['votes'] = -1
                datas['total'] = total
            else:
                total = 0
                for data in datas['options']:
                    flag = Poll.objects.filter(user_id=unique_id,option_id=data['id'])
                    if len(flag) > 0:
                        datas['selected_num'] = Option.objects.get(id=flag[0].option_id).select_num
                    else:
                        if not 'selected_num' in datas:
                            datas['selected_num'] = -1
                    del data['id']
                    del data['share_id']
                    total += data['votes']
                datas['total'] = total
        seri_datas = serializer.data

        response = {}
        response["posts"] = seri_datas
        return Response(response, status.HTTP_200_OK)


class PostDetailDeleteAPIView(views.APIView):
    """投稿の詳細取得&削除APIクラス"""

    def delete(self, request, pk, *args, **kwargs):
        """投稿の削除APIに対応するハンドラメソッド"""
        
        post = Post.objects.get(id=pk)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get(self, request, pk, *args, **kwargs):
        """投稿の詳細取得APIに対応するハンドラメソッド"""

        users = get_user_model().objects.filter(poll_user__post__id=pk)
        serializer = PostDetailSerializer(instance=users, many=True)

        response = {}
        response['voted_sex'] = {'woman':0,'man':0,'others':0,'null':0}
        response['voted_age'] = {'0-10':0,"10-20":0,"20-30":0,"30-40":0,"40-50":0,"50-60":0,"60-":0}
        response['voted_month'] = {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0}
        response['total'] = 0

        for data in serializer.data:
            
            response['total'] += 1

            if data['sex'] == '0':
                response['voted_sex']['woman'] += 1
            elif data['sex'] == '1':
                response['voted_sex']['man'] += 1
            elif data['sex'] == '2':
                response['voted_sex']['others'] += 1
            elif data['sex'] == '3':
                response['voted_sex']['null'] += 1

            if data['age'] < 10:
                response['voted_age']['0-10'] += 1
            elif data['age'] < 20:
                response['voted_age']['10-20'] += 1
            elif data['age'] < 30-40:
                response['voted_age']['20-30'] += 1
            elif data['age'] < 40:
                response['voted_age']['30-40'] += 1
            elif data['age'] < 50:
                response['voted_age']['40-50'] += 1
            elif data['age'] < 60:
                response['voted_age']['50-60'] += 1
            else:
                response['voted_age']['60-'] += 1
            
            if data['born_at'][5:7] == '01':
                response['voted_month']['1'] += 1
            elif data['born_at'][5:7] == '02':
                response['voted_month']['2'] += 1
            elif data['born_at'][5:7] == '03':
                response['voted_month']['3'] += 1
            elif data['born_at'][5:7] == '04':
                response['voted_month']['4'] += 1
            elif data['born_at'][5:7] == '05':
                response['voted_month']['5'] += 1
            elif data['born_at'][5:7] == '06':
                response['voted_month']['6'] += 1
            elif data['born_at'][5:7] == '07':
                response['voted_month']['7'] += 1
            elif data['born_at'][5:7] == '08':
                response['voted_month']['8'] += 1
            elif data['born_at'][5:7] == '09':
                response['voted_month']['9'] += 1
            elif data['born_at'][5:7] == '10':
                response['voted_month']['10'] += 1
            elif data['born_at'][5:7] == '11':
                response['voted_month']['11'] += 1
            elif data['born_at'][5:7] == '12':
                response['voted_month']['12'] += 1

        return Response(response, status.HTTP_200_OK)


class PostUpdateAPIView(views.APIView):
    """投稿の情報更新APIクラス"""

    def get(self, request, pk, sk, *args, **kwargs):
        queryset = Post.objects.get(id=sk)
        serializer = PostListSerializer(instance=queryset, pk=pk)

        seri_data = serializer.data

        if not seri_data['voted']:
            total = 0
            seri_data["selected_num"] = -1
            for data in seri_data['options']:
                del data['id']
                del data['share_id']
                total += data['votes']
                data['votes'] = -1
            seri_data['total'] = total
        else:
            total = 0
            for data in seri_data['options']:
                flag = Poll.objects.filter(user_id=pk,option_id=data['id'])
                if len(flag) > 0:
                    seri_data['selected_num'] = Option.objects.get(id=flag[0].option_id).select_num
                else:
                    if not 'selected_num' in seri_data:
                        seri_data['selected_num'] = -1
                del data['id']
                del data['share_id']
                total += data['votes']
            seri_data['total'] = total
        return Response(seri_data, status.HTTP_200_OK)


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
                data_option['id'] = data['option'] = option.id
                data_option['answer'] = option.answer
                break
        serializer_option = OptionSerializer(instance=Option.objects.get(id=data_option['id']) ,data=data_option)
        serializer_option.is_valid(raise_exception=True)
        serializer_option.save()
        serializer = PollSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response_share_id = serializer_option.data["share_id"]
        response_serializer = OptionSerializer(instance=Option.objects.filter(share_id=response_share_id), many=True)

        for response_data in response_serializer.data:
            del response_data["answer"]
            del response_data["share_id"]
            del response_data["id"]

        response = {}
        response["options"] = response_serializer.data
        response["selected_num"] = data_option['select_num']

        return Response(response, status.HTTP_201_CREATED)