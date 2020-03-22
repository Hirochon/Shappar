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

    def change_required(self, input_data, field):
        """何度も使う処理を関数化(method:test_input_invalid_something_is_required)"""

        serializer = OptionSerializer(data=input_data)
        self.assertEqual(serializer.is_valid(), False)
        self.assertCountEqual(serializer.errors.keys(), [field])
        self.assertCountEqual(
            [x.code for x in serializer.errors[field]],
            ['required'],
        )

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

    def test_input_invalid_something_is_required(self):
        """入力データのバリデーション(NG:何かがリクエストされていない)"""

        input_data = {
            'select_num': 0,
            'answer':'テスト',
            'votes':3,
            'share_id':uuid.uuid4()
        }
        del input_data['select_num']
        # 事前に定義した関数を実行
        self.change_required(input_data, 'select_num')

        input_data['select_num'] = 0
        del input_data['answer']
        self.change_required(input_data, 'answer')

        input_data['answer'] = 'テスト'
        del input_data['share_id']
        self.change_required(input_data, 'share_id')


    def test_input_invalid_answer_shareid_are_blank(self):
        """入力データのバリデーション(NG:answerやshare_idが空文字)"""

        input_data = {
            'select_num':0,
            'answer':'',
            'votes':3,
            'share_id':uuid.uuid4()
        }
        serializer = OptionSerializer(data=input_data)

        self.assertEqual(serializer.is_valid(), False)
        self.assertCountEqual(serializer.errors.keys(), ['answer'])
        self.assertCountEqual(
            [x.code for x in serializer.errors['answer']],
            ['blank'],
        )

        input_data['answer'] = 'テスト'
        input_data['share_id'] = ''
        serializer_share_id = OptionSerializer(data=input_data)
        self.assertEqual(serializer_share_id.is_valid(), False)
        self.assertCountEqual(serializer_share_id.errors.keys(), ['share_id'])
        self.assertCountEqual(
            [x.code for x in serializer_share_id.errors['share_id']],
            ['invalid'],
        )

    def test_output_data(self):
        """出力データの内容検証"""

        option = Option.objects.create(
            select_num=0,
            answer='テスト',
            share_id=uuid.uuid4()
        )
        serializer = OptionSerializer(instance=option)

        expected_data = {
            'id':option.id,
            'select_num':option.select_num,
            'answer':option.answer,
            'votes':option.votes,
            'share_id':str(option.share_id)
        }
        self.assertDictEqual(serializer.data, expected_data)