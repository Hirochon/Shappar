from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Mypage

class Account_MypageSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id','username','usernonamae','iconimage']

class MypageSerializer(serializers.ModelSerializer):
    user = Account_MypageSerializer()
    class Meta:
        model = Mypage
        fields = ['user','introduction','homeimage']
        depth = 1