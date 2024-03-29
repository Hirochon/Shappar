from django.shortcuts import get_object_or_404
from rest_framework import views, status
from rest_framework.response import Response
import uuid

from django.contrib.auth import get_user_model
from .models import Poll, Post, Option
from .serializers import (
    MypageSerializer,
    PostPatchSerializer,
    PostCreateSerializer,
    PostMainListSerializer,
    PostPostedListSerializer,
    PollSerializer,
    OptionSerializer,
    PostDetailSerializer,
)


def Response_unauthorized():
    return Response({"detail": "権限がありません。"}, status.HTTP_401_UNAUTHORIZED)


def Response_post_notfound():
    return Response({"detail": "存在しない投稿IDです。"}, status.HTTP_404_NOT_FOUND)


class MypageAPIView(views.APIView):
    """マイページ用詳細・更新・一部更新APIクラス"""

    def get(self, request, pk, *args, **kwargs):
        """マイページモデルの取得APIに対応するハンドラメソッド"""

        mypage = get_object_or_404(get_user_model(), username=pk)
        serializer = MypageSerializer(instance=mypage)
        return Response(serializer.data, status.HTTP_200_OK)

    def put(self, request, pk, *args, **kwargs):
        """マイページモデルの更新APIに対応するハンドラメソッド"""

        mypage = get_object_or_404(get_user_model(), username=pk)

        if request.user.username != pk:
            return Response_unauthorized()

        serializer = MypageSerializer(instance=mypage, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_200_OK)

    def patch(self, request, pk, *args, **kwargs):
        """マイページモデルの一部更新APIに対応するハンドラメソッド"""

        mypage = get_object_or_404(get_user_model(), username=pk)

        if request.user.username != pk:
            return Response_unauthorized()

        serializer = MypageSerializer(instance=mypage, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status.HTTP_200_OK)


class MypagePostedListAPIView(views.APIView):
    """マイページでの自分の投稿取得(一覧)"""

    def get(self, request, pk, *args, **kwargs):
        """自分の投稿取得(一覧)"""

        user_pk = get_user_model().objects.filter(username=pk)
        if len(user_pk) == 0:
            return Response({'detail': '存在しないユーザーIDです'}, status.HTTP_404_NOT_FOUND)
        user_id = user_pk[0].id

        # リクエストユーザーの定義
        user = request.user

        # pkの投稿をフィルタリング
        if 'pid' in request.GET:
            post_basis = Post.objects.get(id=request.GET['pid'])
            querysets = Post.objects.filter(user_id=user_id, created_at__lt=post_basis.created_at).order_by('-created_at')[:10]
        else:
            querysets = Post.objects.filter(user_id=user_id).order_by('-created_at')[:10]
        serializer = PostPostedListSerializer(instance=querysets, many=True, pk=user.id)

        if user_id == user.id:
            for datas in serializer.data:
                for data in datas['options']:
                    flag = Poll.objects.filter(user_id=user_id, option_id=data['id'])
                    if len(flag) > 0:
                        datas['selected_num'] = Option.objects.get(id=flag[0].option_id).select_num
                    else:
                        if 'selected_num' not in datas:
                            datas['selected_num'] = -1
                    del data['id']
                    del data['share_id']
        else:
            for datas in serializer.data:
                poll = Poll.objects.filter(post_id=datas['post_id'], user_id=user.id)
                if len(poll) == 0:
                    datas['selected_num'] = -1
                    for data in datas['options']:
                        del data['id']
                        del data['share_id']
                        data['votes'] = -1
                else:
                    datas['selected_num'] = Option.objects.get(id=poll[0].option_id).select_num
                    for data in datas['options']:
                        del data['id']
                        del data['share_id']
        seri_datas = serializer.data

        response = {}
        response["posts"] = seri_datas
        return Response(response, status.HTTP_200_OK)


class MypageVotedListAPIView(views.APIView):
    """マイページでの自分の投票取得(一覧)"""

    def get(self, request, pk, *args, **kwargs):
        """自分の投票取得(一覧)"""

        user = get_user_model().objects.filter(username=pk)
        if len(user) == 0:
            return Response({'detail': '存在しないユーザーIDです'}, status.HTTP_404_NOT_FOUND)
        user_id = user[0].id

        if request.user.username != pk:
            return Response(status=status.HTTP_204_NO_CONTENT)

        # 自身の投票のみフィルタリング
        if 'pid' in request.GET:
            post_basis = Post.objects.get(id=request.GET['pid'])
            querysets = Post.objects.filter(poll_post__user__id=user_id, created_at__lt=post_basis.created_at).order_by('-created_at')[:10]
        else:
            querysets = Post.objects.filter(poll_post__user__id=user_id).order_by('-created_at')[:10]

        serializer = PostMainListSerializer(instance=querysets, many=True, pk=user_id)

        for datas in serializer.data:
            if not datas['voted']:
                datas['selected_num'] = -1
                for data in datas['options']:
                    del data['id']
                    del data['share_id']
                    data['votes'] = -1
            else:
                for data in datas['options']:
                    flag = Poll.objects.filter(user_id=user_id, option_id=data['id'])
                    if len(flag) > 0:
                        datas['selected_num'] = Option.objects.get(id=flag[0].option_id).select_num
                    else:
                        if 'selected_num' not in datas:
                            datas['selected_num'] = -1
                    del data['id']
                    del data['share_id']
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
            return Response({"options": [{"answer": "回答は10個以下にしてください。"}]}, status.HTTP_400_BAD_REQUEST)
        elif 2 > len(data['options']):
            return Response({"options": [{"answer": "回答は2個以上にしてください。"}]}, status.HTTP_400_BAD_REQUEST)

        share_uuid = uuid.uuid4()
        data['share_id'] = share_uuid
        for datas in data['options']:
            datas['share_id'] = share_uuid

        data['user'] = request.user.id
        # data['user'] = data['unique_id']

        serializer = PostCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # response = serializer.data
        # del response['user']
        # del response['share_id']

        # for datas in response['options']:
        #     del datas['id']
        #     del datas['share_id']

        return Response({}, status.HTTP_201_CREATED)


class PostListRankAPIView(views.APIView):
    """投稿の作成順取得(一覧)APIクラス"""

    def get(self, request, *args, **kwargs):
        """投稿の作成順取得(一覧)APIに対応するハンドラメソッド"""

        # モデルオブジェクトをクエリ文字列を使ってフィルタリング
        # if 'q' in request.GET:
        #     queryset = Post.objects.filter(question__contains=request.GET['q']).order_by('-total')[:5]
        # else:
        #     queryset = Post.objects.all().order_by('-total')[:5]
        
        queryset = Post.objects.all().order_by('-total')[:5]
        unique_id = request.user.id
        serializer = PostMainListSerializer(instance=queryset, many=True, pk=unique_id)

        i = 0
        response = {}
        if len(serializer.data) > 0:
            flag_data = serializer.data[0]['total']
            for datas in serializer.data:
                if not datas['voted']:
                    datas['selected_num'] = -1
                    for data in datas['options']:
                        del data['id']
                        del data['share_id']
                        data['votes'] = -1
                else:
                    for data in datas['options']:
                        flag = Poll.objects.filter(user_id=unique_id, option_id=data['id'])
                        if len(flag) > 0:
                            datas['selected_num'] = Option.objects.get(id=flag[0].option_id).select_num
                        else:
                            if 'selected_num' not in datas:
                                datas['selected_num'] = -1
                        del data['id']
                        del data['share_id']
                if flag_data == datas['total']:
                    datas['rank'] = i
                else:
                    i += 1
                    flag_data = datas['total']
                    datas['rank'] = i
            seri_datas = serializer.data
            response["posts"] = seri_datas
        
        return Response(response, status.HTTP_200_OK)


class PostListCreatedAPIView(views.APIView):
    """投稿の取得(一覧)APIクラス"""

    def get(self, request, *args, **kwargs):
        """投稿の取得(一覧)APIに対応するハンドラメソッド"""

        # モデルオブジェクトをクエリ文字列を使ってフィルタリング
        if 'q' in request.GET:
            if 'pid' in request.GET:
                post_basis = Post.objects.filter(id=request.GET['pid'])
                if len(post_basis) == 0:
                    return Response_post_notfound()
                queryset = Post.objects.filter(
                    created_at__lt=post_basis[0].created_at, question__contains=request.GET['q']).order_by('-created_at')[:10]
            else:
                queryset = Post.objects.filter(question__contains=request.GET['q']).order_by('-created_at')[:10]
        elif 'pid' in request.GET:
            post_basis = Post.objects.filter(id=request.GET['pid'])
            if len(post_basis) == 0:
                return Response_post_notfound()
            queryset = Post.objects.filter(created_at__lt=post_basis[0].created_at).order_by('-created_at')[:10]
        else:
            queryset = Post.objects.all().order_by('-created_at')[:10]

        unique_id = request.user.id
        serializer = PostMainListSerializer(instance=queryset, many=True, pk=unique_id)

        for datas in serializer.data:
            if not datas['voted']:
                datas['selected_num'] = -1
                for data in datas['options']:
                    del data['id']
                    del data['share_id']
                    data['votes'] = -1
            else:
                for data in datas['options']:
                    flag = Poll.objects.filter(user_id=unique_id, option_id=data['id'])
                    if len(flag) > 0:
                        datas['selected_num'] = Option.objects.get(id=flag[0].option_id).select_num
                    else:
                        if 'selected_num' not in datas:
                            datas['selected_num'] = -1
                    del data['id']
                    del data['share_id']
        seri_datas = serializer.data

        response = {}
        response["posts"] = seri_datas
        return Response(response, status.HTTP_200_OK)


class PostDetailDeleteAPIView(views.APIView):
    """投稿の詳細取得&削除APIクラス"""

    def delete(self, request, pk, *args, **kwargs):
        """投稿の削除APIに対応するハンドラメソッド"""
        
        user_id = request.user.id
        post = Post.objects.filter(id=pk)

        if len(post) == 0:
            return Response_post_notfound()

        if post[0].user_id != user_id:
            return Response_unauthorized()
        
        post[0].delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get(self, request, pk, *args, **kwargs):
        """投稿の詳細取得APIに対応するハンドラメソッド"""

        post = Post.objects.filter(id=pk)

        if len(post) == 0:
            return Response_post_notfound()

        users = get_user_model().objects.filter(poll_user__post__id=pk)
        serializer = PostDetailSerializer(instance=users, many=True)

        response = {}
        response['voted_sex'] = {'woman': 0, 'man': 0, 'others': 0, 'null': 0}
        response['voted_blood_type'] = {'A': 0, 'B': 0, 'O': 0, 'AB': 0, 'others': 0}
        response['voted_age'] = {'0-10': 0, "10-20": 0, "20-30": 0, "30-40": 0, "40-50": 0, "50-60": 0, "60-": 0}
        response['voted_month'] = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0}
        response['total'] = post[0].total

        for data in serializer.data:

            if data['sex'] == '0':
                response['voted_sex']['woman'] += 1
            elif data['sex'] == '1':
                response['voted_sex']['man'] += 1
            elif data['sex'] == '2':
                response['voted_sex']['others'] += 1
            elif data['sex'] == '3':
                response['voted_sex']['null'] += 1

            if data['blood_type'] == '0':
                response['voted_blood_type']['A'] += 1
            elif data['blood_type'] == '1':
                response['voted_blood_type']['B'] += 1
            elif data['blood_type'] == '2':
                response['voted_blood_type']['O'] += 1
            elif data['blood_type'] == '3':
                response['voted_blood_type']['AB'] += 1
            elif data['blood_type'] == '4':
                response['voted_blood_type']['others'] += 1

            if data['age'] < 10:
                response['voted_age']['0-10'] += 1
            elif data['age'] < 20:
                response['voted_age']['10-20'] += 1
            elif data['age'] < 30:
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
    """投稿モデルの投票結果取得APIクラス"""

    def get(self, request, pk, *args, **kwargs):
        """投稿の投票結果取得APIに対応するハンドラメソッド"""

        queryset = Post.objects.filter(id=pk)

        if len(queryset) == 0:
            return Response_post_notfound()

        user = request.user
        serializer = PostMainListSerializer(instance=queryset[0], pk=user.id)

        seri_data = serializer.data

        if not seri_data['voted']:
            seri_data["selected_num"] = -1
            for data in seri_data['options']:
                del data['id']
                del data['share_id']
                data['votes'] = -1
        else:
            for data in seri_data['options']:
                flag = Poll.objects.filter(user_id=user.id, option_id=data['id'])
                if len(flag) > 0:
                    seri_data['selected_num'] = Option.objects.get(id=flag[0].option_id).select_num
                else:
                    if 'selected_num' not in seri_data:
                        seri_data['selected_num'] = -1
                del data['id']
                del data['share_id']
        return Response(seri_data, status.HTTP_200_OK)


class PollCreateAPIView(views.APIView):
    """投票モデルの登録APIクラス"""

    def post(self, request, pk, *args, **kwargs):
        """投票時の登録APIに対応するハンドラメソッド"""

        post = Post.objects.filter(id=pk)
        if len(post) == 0:
            return Response_post_notfound()

        data = request.data

        # 投票用のデータを代入しつつ、合計投票用のデータ群も作成
        data['post'] = post[0].id
        data_post = {}
        data_post['post'] = post[0].id
        data_post['total'] = post[0].total

        data['user'] = request.user.id
        # data['user'] = data['unique_id']
        # del data['unique_id']
        data_option = data['option']
        del data['option']

        flag = 0
        options = Option.objects.filter(share_id=post[0].share_id)
        for option in options:
            if option.select_num == data_option['select_num']:
                option.votes += 1
                data_post['total'] += 1
                data_option['votes'] = option.votes
                data_option['share_id'] = option.share_id
                data_option['id'] = data['option'] = option.id
                data_option['answer'] = option.answer
                flag += 1
                break

        # リクエストに存在しない選択肢があった時
        if flag == 0:
            return Response({"detail": "存在しない選択肢です。"}, status.HTTP_404_NOT_FOUND)
        
        serializer_option = OptionSerializer(instance=Option.objects.get(id=data_option['id']), data=data_option)
        serializer_option.is_valid(raise_exception=True)
        serializer_option.save()

        serializer_post = PostPatchSerializer(instance=post[0], data=data_post)
        serializer_post.is_valid(raise_exception=True)
        serializer_post.save()

        serializer = PollSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response_serializer = OptionSerializer(instance=Option.objects.filter(share_id=serializer_option.data["share_id"]), many=True)

        for response_data in response_serializer.data:
            del response_data["answer"]
            del response_data["share_id"]
            del response_data["id"]

        response = {}
        response["options"] = response_serializer.data
        response["selected_num"] = data_option['select_num']
        response['total'] = data_post['total']

        return Response(response, status.HTTP_201_CREATED)
