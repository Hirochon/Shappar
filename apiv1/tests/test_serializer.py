import uuid
from django.test import TestCase
from django.utils.timezone import localtime
from django.core.files import File

from django.contrib.auth import get_user_model
from apiv1.models import Post, Poll, Option
from apiv1.serializers import (
    PostCreateSerializer, 
    PostListSerializer, 
    PollSerializer, 
    OptionSerializer,
    PostDetailSerializer,
)

# (正常系)2methods,(異常系)2methods,(合計)4methods.
class TestOptionSerializer(TestCase):
    """OptionSerializerのテストクラス"""

    def test_input_valid(self):
        """入力データのバリデーション(OK)"""

        # シリアライザを作成
        input_data = {
            'select_num':1,
            'answer':'テスト',
            'votes':3,
            'share_id':uuid.uuid4()
        }
        serializer = OptionSerializer(data=input_data)

        # バリデーションの結果を検証
        self.assertEqual(serializer.is_valid(), True)