from django.shortcuts import get_object_or_404
from rest_framework import views, status
from rest_framework.response import Response

from django.contrib.auth import get_user_model
from .models import Mypage
from .serializers import MypageSerializer

class MypageAPIView(views.APIView):
    """マイページ用APIクラス"""

    def get(self, request, pk, *args, **kwargs):
        """マイページモデルをGETメソッド"""

        """エンドポイントをユーザIDによってマイページを取得する場合"""
        user = get_user_model().objects.get(username=pk)
        mypage = get_object_or_404(Mypage, user_id=user.id)

        # """エンドポイントをUUIDによってマイページを取得する場合"""
        # mypage = get_object_or_404(Mypage, user_id=pk)

        serializer = MypageSerializer(instance=mypage)
        return Response(serializer.data, status.HTTP_200_OK)