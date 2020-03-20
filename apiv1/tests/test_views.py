from django.utils.timezone import localtime
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model
from apiv1.models import Poll, Post, Option
from config.settings import circleci

# (正常系)2methods,(異常系)4methods,(合計)6methods.
class TestMypageAPIView(APITestCase):
    """MypageAPIViewのテストクラス"""

    TARGET_URL_WITH_PK = '/api/v1/users/{}/'

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user1 = get_user_model().objects.create_user(
            email='user1@example.com',
            username='user1',
            password='secret',
            usernonamae='サンプル1',
            sex='0',
            age=21,
            born_at='1998-08-10',
        )
        cls.user2 = get_user_model().objects.create_user(
            email='user2@example.com',
            username='user2',
            password='secret',
            usernonamae='サンプル2',
            sex='1',
            age=19,
            born_at='2001-12-02',
        )
    
    def test_get_own_mypage_success(self):
        """ユーザーモデルの詳細取得APIへのGETリクエスト(正常系)"""

        # ログイン(JWT認証)
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # APIリクエストを実行
        response = self.client.get(self.TARGET_URL_WITH_PK.format('user1'))

        # ユーザモデルを取得
        user1 = get_user_model().objects.get(username='user1')
        # データベースの状態を検証
        self.assertEqual(get_user_model().objects.count(), 2)
        # レスポンスの内容を検証
        self.assertEqual(response.status_code, 200)
        expected_json_dict = {
            'user_id':user1.username,
            'name':user1.usernonamae,
            'introduction':user1.introduction,
            'iconimage':circleci.MEDIA_URL + str(user1.iconimage),
            'homeimage':circleci.MEDIA_URL + str(user1.homeimage),
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_patch_own_mypage_success(self):
        """ユーザーモデルの一部更新APIへのPATCHリクエスト(正常系)"""

        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        params = {
            'name':'サンプルさん',
            'introduction':'どーも。サンプルさんだよ〜！'
        }
        response = self.client.patch(self.TARGET_URL_WITH_PK.format('user1'), params, format='json')

        user1 = get_user_model().objects.get(username='user1')
        self.assertEqual(get_user_model().objects.count(), 2)
        self.assertEqual(response.status_code, 200)
        expected_json_dict = {
            'user_id':user1.username,
            'name':user1.usernonamae,
            'introduction':user1.introduction,
            'iconimage':circleci.MEDIA_URL + str(user1.iconimage),
            'homeimage':circleci.MEDIA_URL + str(user1.homeimage),
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_mypage_unauthorized(self):
        """ユーザーモデルの詳細取得APIへのGETリクエスト(異常系:リクエストのヘッダーにトークンが乗っていない時)"""

        # あえてJWT認証によるログインをしない。
        # APIリクエストを実行
        response = self.client.get(self.TARGET_URL_WITH_PK.format('user1'))

        # レスポンスの内容を検証
        self.assertEqual(response.status_code, 401)
        expected_json_dict = {
            "detail": "認証情報が含まれていません。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_patch_other_mypage_unauthorized(self):
        """ユーザーモデルの一部更新APIへのPATCHリクエスト(異常系:リクエストしたユーザーとエンドポイントのユーザーが異なる時)"""
        
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        params = {
            'name':'サンプルさん',
            'introduction':'どーも。サンプルさんだよ〜！'
        }
        # JWT認証とは異なるユーザーIDを代入
        response = self.client.patch(self.TARGET_URL_WITH_PK.format('user2'), params, format='json')

        self.assertEqual(response.status_code, 401)
        expected_json_dict = {
            "detail":"権限がありません。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_own_mypage_not_found(self):
        """ユーザーモデルの詳細取得APIへのGETリクエスト(異常系:エンドポイントのユーザーIDが存在しない時)"""

        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # 存在しないユーザーIDを代入
        response = self.client.get(self.TARGET_URL_WITH_PK.format('user3'))

        self.assertEqual(response.status_code, 404)
        expected_json_dict = {
            "detail": "見つかりませんでした。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_patch_own_mypage_not_found(self):
        """ユーザーモデルの詳細取得APIへのPATCHリクエスト(異常系:エンドポイントのユーザーIDが存在しない時)"""

        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        params = {
            'name':'サンプルさん',
            'introduction':'どーも。サンプルさんだよ〜！'
        }
        # 存在しないユーザーIDを代入
        response = self.client.patch(self.TARGET_URL_WITH_PK.format('user3'), params, format='json')

        self.assertEqual(response.status_code, 404)
        expected_json_dict = {
            "detail": "見つかりませんでした。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)


# (正常系)2methods,(異常系)3methods,(合計)5methods
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

    def test_post_create_options_2_success(self):
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

    def test_post_create_options_10_success(self):
        """投稿モデルの登録APIへのPOSTリクエスト(正常系)"""

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
            }]
        }
        response = self.client.post(self.TARGET_URL, params, format='json')

        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(response.status_code, 201)

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

        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

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