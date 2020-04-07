import uuid
from django.test import TestCase
from apiv1.models import Option
from apiv1.serializers import (
    OptionSerializer,
    PostCreateSerializer
)
from django.contrib.auth import get_user_model


# (正常系)2methods,(異常系)3methods,(合計)5methods.
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
        """OptionSerializerの入力データのバリデーション(OK)"""

        # シリアライズ
        input_data = {
            'select_num': 1,
            'answer': 'テスト',
            'votes': 3,
            'share_id': uuid.uuid4()
        }
        serializer = OptionSerializer(data=input_data)
        # バリデーションの結果を検証
        self.assertEqual(serializer.is_valid(), True)

    def test_input_invalid_something_is_required(self):
        """OptionSerializerの入力データのバリデーション(NG:何かがリクエストされていない)"""

        input_data = {
            'select_num': 0,
            'answer': 'テスト',
            'votes': 3,
            'share_id': uuid.uuid4()
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
        """OptionSerializerの入力データのバリデーション(NG:answerやshare_idが空文字)"""

        input_data = {
            'select_num': 0,
            'answer': '',
            'votes': 3,
            'share_id': uuid.uuid4()
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

    def test_input_invalid_answer_over(self):
        """OptionSerializerの入力データのバリデーション(NG:answerが文字数制限を超える)"""

        input_data = {
            'select_num': 0,
            'answer': 'テストテストテストテストテストテストテストテストテストテストテストテストテストテスト',
            'votes': 3,
            'share_id': uuid.uuid4()
        }
        serializer = OptionSerializer(data=input_data)

        self.assertEqual(serializer.is_valid(), False)
        self.assertCountEqual(serializer.errors.keys(), ['answer'])
        self.assertCountEqual(
            [x.code for x in serializer.errors['answer']],
            ['max_length'],
        )

    def test_output_data(self):
        """OptionSerializerの出力データの内容検証(OK)"""

        option = Option.objects.create(
            select_num=0,
            answer='テスト',
            share_id=uuid.uuid4()
        )
        serializer = OptionSerializer(instance=option)

        expected_data = {
            'id': option.id,
            'select_num': option.select_num,
            'answer': option.answer,
            'votes': option.votes,
            'share_id': str(option.share_id)
        }
        self.assertDictEqual(serializer.data, expected_data)


# (正常系)1methods,(異常系)1methods,(合計)2methods.
class TestPostCreateSerializer(TestCase):
    """PostCreateSerializerのテストクラス"""

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user1 = get_user_model().objects.create_user(
            email='user1@example.com',
            username='user1',
            password='secret',
            usernonamae='サンプル1',
            sex='0',
            blood_type='0',
            age=21,
            born_at='1998-08-10',
        )

    def test_input_valid(self):
        """PostCreateSerializerの入力データのバリデーション(OK)"""

        share_id = uuid.uuid4()
        data1 = {
            'select_num': 0,
            'answer': 'テスト1',
            'votes': 1,
            'share_id': share_id
        }
        data2 = {
            'select_num': 1,
            'answer': 'テスト2',
            'votes': 2,
            'share_id': share_id
        }

        # シリアライズ
        input_data = {
            'user': get_user_model().objects.get().id,
            'question': 'テストだよ〜',
            'options': [data1, data2],
            'share_id': share_id
        }
        serializer = PostCreateSerializer(data=input_data)
        # バリデーションの結果を検証
        self.assertEqual(serializer.is_valid(), True)

    def test_input_invalid_unshared_options(self):
        """PostCreateSerializerの入力データのバリデーション(NG: 選択肢間でshare_idが共通でない)"""

        share_id = uuid.uuid4()
        data1 = {
            'select_num': 0,
            'answer': 'テスト1',
            'votes': 1,
            'share_id': share_id
        }
        data2 = {
            'select_num': 1,
            'answer': 'テスト2',
            'votes': 2,
            'share_id': uuid.uuid4()
        }

        # シリアライズ
        input_data = {
            'user': get_user_model().objects.get().id,
            'question': 'テストだよ〜',
            'options': [data1, data2],
            'share_id': share_id
        }
        serializer = PostCreateSerializer(data=input_data)
        # バリデーションの結果を検証
        self.assertEqual(serializer.is_valid(), False)
        self.assertCountEqual(serializer.errors.keys(), ['non_field_errors'])
        self.assertCountEqual(
            [x.code for x in serializer.errors['non_field_errors']],
            ['invalid'],
        )

    def test_input_invalid_unshared_post_option(self):
        """PostCreateSerializerの入力データのバリデーション(NG: 投稿と選択肢でshare_idが共通でない)"""

        share_id = uuid.uuid4()
        data1 = {
            'select_num': 0,
            'answer': 'テスト1',
            'votes': 1,
            'share_id': share_id
        }
        data2 = {
            'select_num': 1,
            'answer': 'テスト2',
            'votes': 2,
            'share_id': share_id
        }

        # シリアライズ
        input_data = {
            'user': get_user_model().objects.get().id,
            'question': 'テストだよ〜',
            'options': [data1, data2],
            'share_id': uuid.uuid4()
        }
        serializer = PostCreateSerializer(data=input_data)
        # バリデーションの結果を検証
        self.assertEqual(serializer.is_valid(), False)
        self.assertCountEqual(serializer.errors.keys(), ['non_field_errors'])
        self.assertCountEqual(
            [x.code for x in serializer.errors['non_field_errors']],
            ['invalid'],
        )
