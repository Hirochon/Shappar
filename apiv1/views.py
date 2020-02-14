from django.shortcuts import get_object_or_404
from rest_framework import views, status
from rest_framework.response import Response

from django.contrib.auth import get_user_model
from .serializers import MypageSerializer

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

# class PostAPIView(view.APIView):
#     """投稿用APIクラス"""

#     def post(self, request, *args, **kwargs):
#         """投稿時の登録APIに対応するハンドラメソッド"""

#         serializer = 
