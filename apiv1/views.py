from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from django.contrib.auth import get_user_model
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    """本モデルのCRUD用APIクラス"""

    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]