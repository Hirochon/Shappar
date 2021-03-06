# import base64
# from io import BytesIO
# from PIL import Image
# from django.db import models
import uuid
from django.test import TestCase
from apiv1.models import Option
from apiv1.serializers import (
    # MypageSerializer,
    OptionSerializer,
    PostCreateSerializer,
    PostPatchSerializer,
)
from django.contrib.auth import get_user_model


def change_required(self, serializer, field):
    """requiredに関する処理を関数化(method:test_input_invalid_something_is_required)"""

    self.assertEqual(serializer.is_valid(), False)
    self.assertCountEqual(serializer.errors.keys(), [field])
    self.assertCountEqual(
        [x.code for x in serializer.errors[field]],
        ['required'],
    )


# (総数)14methods.

# (正常系)2methods,(異常系)3methods,(合計)5methods.
class TestOptionSerializer(TestCase):
    """OptionSerializerのテストクラス"""

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
        serializer = OptionSerializer(data=input_data)
        change_required(self, serializer, 'select_num')

        input_data['select_num'] = 0
        del input_data['answer']
        serializer = OptionSerializer(data=input_data)
        change_required(self, serializer, 'answer')

        input_data['answer'] = 'テスト'
        del input_data['share_id']
        serializer = OptionSerializer(data=input_data)
        change_required(self, serializer, 'share_id')

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


# (正常系)1method,(異常系)6methods,(合計)7methods.
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

        # 入力データの加工
        input_data = {
            'user': get_user_model().objects.get().id,
            'question': 'テストだよ〜',
            'options': [data1, data2],
            'share_id': share_id
        }
        # シリアライズ
        serializer = PostCreateSerializer(data=input_data)
        # バリデーションの結果を検証
        self.assertEqual(serializer.is_valid(), True)
    
    def test_input_invalid_question_over(self):
        """PostCreateSerializerの入力データのバリデーション(NG: questionが150字より上)"""

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

        # 入力データの加工
        input_data_valid = {
            'user': get_user_model().objects.get().id,
            'question': 'テストだよ' * 30,
            'options': [data1, data2],
            'share_id': share_id
        }
        # シリアライズ(境界値もテストするよ！)
        serializer_valid = PostCreateSerializer(data=input_data_valid)
        self.assertEqual(serializer_valid.is_valid(), True)

        input_data_invalid = {
            'user': get_user_model().objects.get().id,
            'question': 'テストだよ' * 31,
            'options': [data1, data2],
            'share_id': share_id
        }
        # シリアライズ(境界値もテストするよ！)
        serializer = PostCreateSerializer(data=input_data_invalid)
        # バリデーションの結果を検証
        self.assertEqual(serializer.is_valid(), False)
        self.assertCountEqual(serializer.errors.keys(), ['question'])
        self.assertCountEqual(
            [x.code for x in serializer.errors['question']],
            ['max_length'],
        )

    def test_input_invalid_something_is_required(self):
        """PostCreateSerializerの入力データのバリデーション(NG: 必須の入力データが存在しない時)"""
        
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

        # 入力データの加工
        input_data = {
            'user': get_user_model().objects.get().id,
            'question': 'テストだよ〜！',
            'options': [data1, data2],
            'share_id': share_id
        }

        # シリアライズ
        del input_data['user']
        serializer = PostCreateSerializer(data=input_data)
        change_required(self, serializer, 'user')

        input_data['user'] = get_user_model().objects.get().id
        del input_data['question']
        serializer = PostCreateSerializer(data=input_data)
        change_required(self, serializer, 'question')

        input_data['question'] = 'テストだよ〜！'
        del input_data['options']
        serializer = PostCreateSerializer(data=input_data)
        change_required(self, serializer, 'options')

        input_data['options'] = [data1, data2]
        del input_data['share_id']
        serializer = PostCreateSerializer(data=input_data)
        change_required(self, serializer, 'share_id')

    def test_input_invalid_user_or_question_is_blank(self):
        """OptionSerializerの入力データのバリデーション(NG: questionかuserの値が空文字)"""

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

        # 入力データの加工
        input_data = {
            'user': get_user_model().objects.get().id,
            'question': 'テストだよ〜！',
            'options': [data1, data2],
            'share_id': share_id
        }
        input_data['user'] = ''
        serializer_user = PostCreateSerializer(data=input_data)
        self.assertEqual(serializer_user.is_valid(), False)
        self.assertCountEqual(serializer_user.errors.keys(), ['user'])
        self.assertCountEqual(
            [x.code for x in serializer_user.errors['user']],
            ['null'],
        )

        input_data['user'] = get_user_model().objects.get().id
        input_data['question'] = ''
        serializer_question = PostCreateSerializer(data=input_data)
        self.assertEqual(serializer_question.is_valid(), False)
        self.assertCountEqual(serializer_question.errors.keys(), ['question'])
        self.assertCountEqual(
            [x.code for x in serializer_question.errors['question']],
            ['blank'],
        )
    
    def test_input_invalid_lesser_2_options(self):
        """PostCreateSerializerの入力データのバリデーション(NG: 選択肢が2個未満だった時)"""
        share_id = uuid.uuid4()
        data1 = {
            'select_num': 0,
            'answer': 'テスト1',
            'votes': 1,
            'share_id': share_id
        }

        # シリアライズ(境界値もテストするよ！)
        input_data = {
            'user': get_user_model().objects.get().id,
            'question': 'テストだよ〜！',
            'options': [data1],
            'share_id': share_id
        }
        serializer = PostCreateSerializer(data=input_data)
        # バリデーションの結果を検証
        self.assertEqual(serializer.is_valid(), False)
        self.assertCountEqual(serializer.errors.keys(), ['options'])
        self.assertCountEqual(
            [x.code for x in serializer.errors['options']],
            ['invalid'],
        )

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


# (正常系)1method,(異常系)1method,(合計)2method.
class TestPostPatchSerializer(TestCase):
    """PostPatchSerializerのテストクラス"""

    def test_input_valid(self):
        """"PostPatchSerializerの入力(パッチ)データのバリデーション(OK)"""

        # シリアライズ
        input_data = {
            'id': uuid.uuid4(),
            'total': 1,
        }
        serializer = PostPatchSerializer(data=input_data)
        # バリデーションの結果を検証
        self.assertEqual(serializer.is_valid(), True)

    def test_input_invalid_lesser_0_total(self):
        """PostPatchSerializerの入力(パッチ)データのバリデーション(NG: totalパラメーターで1未満がリクエストされた時)"""

        # シリアライズ
        input_data = {
            'id': uuid.uuid4(),
            'total': 0,
        }
        serializer = PostPatchSerializer(data=input_data)
        # バリデーションの結果を検証
        self.assertEqual(serializer.is_valid(), False)
        self.assertCountEqual(serializer.errors.keys(), ['total'])
        self.assertCountEqual(
            [x.code for x in serializer.errors['total']],
            ['invalid'],
        )


# class TestMypageSrializer(TestCase):
#     """TestMypageSrializerのテストクラス"""

#     @classmethod
#     def setUpClass(cls):
#         super().setUpClass()
#         cls.user1 = get_user_model().objects.create_user(
#             email='user1@example.com',
#             username='user1',
#             password='secret',
#             usernonamae='サンプル1',
#             introduction='サンプルだよ〜！',
#             sex='0',
#             blood_type='0',
#             age=21,
#             born_at='1998-08-10',
#         )

#     def test_input_valid(self):
#         """PostCreateSerializerの入力データのバリデーション(OK)"""

#         FILE_PATH_ICON = 'apiv1/tests/test_images/icon.png'
#         # FILE_PATH_HOME = 'apiv1/tests/test_images/home.jpg'

#         buffered = BytesIO()
#         img_icon = open(FILE_PATH_ICON, 'rb')
#         # img_home = Image.open(FILE_PATH_HOME)
#         # img_icon.save(buffered, format="PNG")
#         # img_home.save(buffered, format="JPG")
#         # request_img_icon = base64.b64encode(buffered.getvalue()).decode("utf-8")
#         # request_img_home = base64.b64encode(buffered.getvalue()).decode("utf-8")


#         # _file = open(, 'rb')

#         # 入力データの加工
#         input_data = {
#             'user_id': get_user_model().objects.get().username,
#             'name': '進化サンプル',
#             'introduction': 'サンプルが進化したよ〜。',
#             'iconimage': iconimage
#         }
#         # シリアライズ
#         serializer = MypageSerializer(data=input_data)
#         # バリデーションの結果を検証
#         serializer.is_valid()
#         print(serializer.errors)
#         self.assertEqual(serializer.is_valid(), True)
