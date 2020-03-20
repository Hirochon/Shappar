from django.utils.timezone import localtime
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model
from apiv1.models import Poll, Post, Option


class TestPostCreateAPIView(APITestCase):
    """PostCreateAPIViewのテストクラス"""

    TARGET_URL = '/api/v1/posts/'

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = get_user_model().objects.create_user(
            email='user@example.com',
            username='user',
            password='secret',
            usernonamae='サンプル',
            sex='0',
            age=24,
            born_at='1998-08-10',
        )

    def test_post_create_success(self):
        """投稿モデルの登録APIへのPOSTリクエスト(正常系)"""

        # ログイン(JWT認証)
        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # APIリクエストを実行
        params = {
            'question':'あなたの推しメンは？',
            'options':[{
                'select_num':0,
                'answer':'齋藤飛鳥'
            },{
                'select_num':1,
                'answer':'北野日奈子'
            }]
        }
        response = self.client.post(self.TARGET_URL, params, format='json')

        # データベースの状態を検証
        self.assertEqual(Post.objects.count(), 1)
        # レスポンスの内容を検証
        self.assertEqual(response.status_code, 201)
        
        # post = Post.objects.get()
        # # ネスト化している部分を代入
        # option_set = Option.objects.all()
        # options = list()
        # for option in option_set:
        #     add_dict = {}
        #     add_dict['select_num'] = option.select_num
        #     add_dict['answer'] = option.answer
        #     add_dict['votes'] = option.votes
        #     options.append(add_dict)

        # expected_json_dict = {
        #     'question': post.question,
        #     'options': options
        # }

        expected_json_dict = {}

        self.assertJSONEqual(response.content, expected_json_dict)

    def test_post_create_unauthorized(self):
        """投稿モデルの登録APIへのPOSTリクエスト(異常系:リクエストのヘッダーにトークンが乗っていない時)"""

        # あえてJWT認証によるログインをしない。

        # APIリクエストを実行
        params = {
            'question':'あなたの推しメンは？',
            'options':[{
                'select_num':0,
                'answer':'齋藤飛鳥'
            },{
                'select_num':1,
                'answer':'北野日奈子'
            }]
        }
        response = self.client.post(self.TARGET_URL, params, format='json')

        self.assertEqual(Post.objects.count(), 0)
        self.assertEqual(response.status_code, 401)

        expected_json_dict = {
            "detail": "認証情報が含まれていません。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    
    def test_post_create_options_1_bad_request(self):
        """投稿モデルの登録APIへのPOSTリクエスト(異常系:リクエストのoptionsリストが2個未満の時)"""

        # ログイン(JWT認証)
        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # APIリクエストを実行
        params = {
            'question':'あなたの推しメンは？',
            'options':[{
                'select_num':0,
                'answer':'齋藤飛鳥'
            }]
        }
        response = self.client.post(self.TARGET_URL, params, format='json')

        self.assertEqual(Post.objects.count(), 0)
        self.assertEqual(response.status_code, 400)

        expected_json_dict = {
            "options":[{"answer":"回答は2個以上にしてください。"}]
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_post_create_options_11_bad_request(self):
        """投稿モデルの登録APIへのPOSTリクエスト(異常系:リクエストのoptionsリストが10個以下ではなかった時)"""

        # ログイン(JWT認証)
        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # APIリクエストを実行
        params = {
            "question":"あなたの推しメンは？",
            "options":[{
                "select_num":1,
                "answer":"齋藤飛鳥"
            },{
                "select_num":2,
                "answer":"北野日奈子"
            },{
                "select_num":3,
                "answer":"柿崎芽実"
            },{
                "select_num":4,
                "answer":"金村美玖"
            },{
                "select_num":5,
                "answer":"星野みなみ"
            },{
                "select_num":6,
                "answer":"東村芽依"
            },{
                "select_num":7,
                "answer":"河田陽菜"
            },{
                "select_num":8,
                "answer":"山下美月"
            },{
                "select_num":9,
                "answer":"与田祐希"
            },{
                "select_num":10,
                "answer":"渡辺みりあ"
            },{
                "select_num":11,
                "answer":"井口眞緒"
            }]
        }
        response = self.client.post(self.TARGET_URL, params, format='json')

        self.assertEqual(Post.objects.count(), 0)
        self.assertEqual(response.status_code, 400)

        expected_json_dict = {
            "options":[{"answer":"回答は10個以下にしてください。"}]
        }
        self.assertJSONEqual(response.content, expected_json_dict)