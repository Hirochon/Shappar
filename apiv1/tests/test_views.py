import uuid
from datetime import datetime, timedelta
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model
from apiv1.models import Poll, Post, Option
from config.settings import circleci


# Optionsのリスト作成関数
def create_options_list(options):
    options_list = []
    for option in options:
        option_dict = {}
        option_dict['select_num'] = option.select_num
        option_dict['answer'] = option.answer
        option_dict['votes'] = option.votes
        options_list.append(option_dict)
    return options_list


# クエリセットクラスから取得した投稿日時を日本時間へ変形関数
def change_created_at(post):
    post_created_at = str(post.created_at)
    hours = timedelta(hours=9)
    utc_created_at = datetime.strptime(post_created_at, '%Y-%m-%d %H:%M:%S.%f%z')
    created_at = utc_created_at + hours
    return created_at


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
            blood_type='0',
            age=21,
            born_at='1998-08-10',
        )
        cls.user2 = get_user_model().objects.create_user(
            email='user2@example.com',
            username='user2',
            password='secret',
            usernonamae='サンプル2',
            sex='1',
            blood_type='1',
            age=19,
            born_at='2001-12-02',
        )
        cls.params = {
            'name': 'サンプルさん',
            'introduction': 'どーも。サンプルさんだよ〜！'
        }
    
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
            'user_id': user1.username,
            'name': user1.usernonamae,
            'introduction': user1.introduction,
            'iconimage': circleci.MEDIA_URL + str(user1.iconimage),
            'homeimage': circleci.MEDIA_URL + str(user1.homeimage),
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_patch_own_mypage_success(self):
        """ユーザーモデルの一部更新APIへのPATCHリクエスト(正常系)"""

        # ログイン
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # リクエストを実行
        response = self.client.patch(self.TARGET_URL_WITH_PK.format('user1'), self.params, format='json')
        self.assertEqual(get_user_model().objects.count(), 2)
        self.assertEqual(response.status_code, 200)

        # 予期されるレスポンスを作成
        user1 = get_user_model().objects.get(username='user1')
        expected_json_dict = {
            'user_id': user1.username,
            'name': user1.usernonamae,
            'introduction': user1.introduction,
            'iconimage': circleci.MEDIA_URL + str(user1.iconimage),
            'homeimage': circleci.MEDIA_URL + str(user1.homeimage),
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

        # JWT認証とは異なるユーザーIDを代入
        response = self.client.patch(self.TARGET_URL_WITH_PK.format('user2'), self.params, format='json')

        self.assertEqual(response.status_code, 401)
        expected_json_dict = {
            "detail": "権限がありません。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_mypage_not_found(self):
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

    def test_patch_mypage_not_found(self):
        """ユーザーモデルの詳細取得APIへのPATCHリクエスト(異常系:エンドポイントのユーザーIDが存在しない時)"""

        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # 存在しないユーザーIDを代入
        response = self.client.patch(self.TARGET_URL_WITH_PK.format('user3'), self.params, format='json')

        self.assertEqual(response.status_code, 404)
        expected_json_dict = {
            "detail": "見つかりませんでした。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)


# (正常系)2methods,(異常系)2methods,(合計)4methods.
class TestMypageVotedListAPIView(APITestCase):
    """MypageVotedListAPIViewのテストクラス"""

    TARGET_URL_WITH_PK = '/api/v1/users/{}/voted/'

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
        cls.user2 = get_user_model().objects.create_user(
            email='user2@example.com',
            username='user2',
            password='secret',
            usernonamae='サンプル2',
            sex='1',
            blood_type='1',
            age=19,
            born_at='2001-12-02',
        )
        cls.post_params = {
            'question': 'あなたの推しメンは？',
            'options': [{
                'select_num': 0,
                'answer': '齋藤飛鳥'
            }, {
                'select_num': 1,
                'answer': '北野日奈子'
            }]
        }
        cls.vote_params = {
            'option': {
                'select_num': 0
            }
        }

    def test_get_own_voted_posts_success(self):
        """ユーザーモデルの投票済みの投稿一覧取得APIへのGETリクエスト(正常系:投票済み一覧はユーザー本人であれば返す)"""

        # 投稿用ユーザーでログイン→投稿
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # POSTメソッドの投稿リクエスト
        self.client.post('/api/v1/posts/', self.post_params, format='json')

        # 投票用ユーザーでログイン→投票
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        post = Post.objects.get()
        self.client.post('/api/v1/posts/{}/polls/'.format(post.id), self.vote_params, format='json')

        response = self.client.get(self.TARGET_URL_WITH_PK.format(self.user2.username))
        self.assertEqual(response.status_code, 200)

        # 予期されるjsonレスポンスを作成
        # 選択肢の中身を作成
        options = Option.objects.filter(share_id=post.share_id)
        options_list = create_options_list(options)
        # 投稿日時をShappar仕様に変形
        created_at = change_created_at(post)
        # 合計投票数を再算出
        total = Post.objects.get().total
        expected_json_dict = {
            'posts': [{
                'post_id': str(post.id),
                'user_id': str(post.user.username),
                'iconimage': circleci.MEDIA_URL + str(post.user.iconimage),
                'question': post.question,
                'created_at': created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
                'voted': True,
                'selected_num': 0,
                'total': total,
                'options': options_list
            }]
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_voted_posts_success(self):
        """ユーザーモデルの投票済みの投稿一覧取得APIへのGETリクエスト(正常系:マイページの投票済み一覧は他人には返さない)"""

        # 投稿用ユーザーでログイン→投稿
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.post_params, format='json')

        # 投票用ユーザーでログイン→投票
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        post = Post.objects.get()
        self.client.post('/api/v1/posts/{}/polls/'.format(post.id), self.vote_params, format='json')

        # 投稿ユーザーで再びログイン→投票ユーザーの投票済み一覧表示を試みる
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        response = self.client.get(self.TARGET_URL_WITH_PK.format(self.user2.username))
        self.assertEqual(response.status_code, 204)

    def test_get_voted_posts_unauthorized(self):
        """ユーザーモデルの投票済みの投稿一覧取得APIへのGETリクエスト(異常系:ヘッダーにトークンがのっていない時)"""

        # あえてヘッダーにトークンを載せない

        response = self.client.get(self.TARGET_URL_WITH_PK.format(self.user2.username))
        self.assertEqual(response.status_code, 401)

        expected_json_dict = {
            "detail": "認証情報が含まれていません。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_voted_posts_not_found(self):
        """ユーザーモデルの投票済みの投稿一覧取得APIへのGETリクエスト(異常系:リクエストしたエンドポイントのユーザーIDが存在しない時)"""

        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        response = self.client.get(self.TARGET_URL_WITH_PK.format('user3'))
        self.assertEqual(response.status_code, 404)

        expected_json_dict = {
            'detail': '存在しないユーザーIDです'
        }
        self.assertJSONEqual(response.content, expected_json_dict)


# (正常系)2methods,(異常系)2methods,(合計)4methods.
class TestMypagePostedListAPIView(APITestCase):
    """MypagePostedListAPIViewのテストクラス"""

    TARGET_URL_WITH_PK = '/api/v1/users/{}/posted/'

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
        cls.user2 = get_user_model().objects.create_user(
            email='user2@example.com',
            username='user2',
            password='secret',
            usernonamae='サンプル2',
            sex='1',
            blood_type='1',
            age=19,
            born_at='2001-12-02',
        )
        cls.post_params = {
            'question': 'あなたの推しメンは？',
            'options': [{
                'select_num': 0,
                'answer': '齋藤飛鳥'
            }, {
                'select_num': 1,
                'answer': '北野日奈子'
            }]
        }
        cls.vote_params = {
            'option': {
                'select_num': 0
            }
        }

    def test_get_other_posted_posts_success(self):
        """ユーザーモデルの投稿済みの投稿一覧取得APIへのGETリクエスト(正常系:投稿一覧を投票者が見る場合)"""

        # 投稿用ユーザーでログイン→投稿
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.post_params, format='json')

        # 投票用ユーザーでログイン→投票
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        post = Post.objects.get()
        self.client.post('/api/v1/posts/{}/polls/'.format(post.id), self.vote_params, format='json')

        # 投票ユーザーで投稿ユーザーの投稿一覧を取得
        response = self.client.get(self.TARGET_URL_WITH_PK.format(self.user1.username))
        self.assertEqual(response.status_code, 200)

        # 予期されるjsonレスポンスを作成
        # 選択肢の中身を作成
        options = Option.objects.filter(share_id=post.share_id)
        options_list = create_options_list(options)
        # 投稿日時を日本時間へ変更
        created_at = change_created_at(post)
        # 合計投票数を再算出
        total = Post.objects.get().total
        expected_json_dict = {
            'posts': [{
                'post_id': str(post.id),
                'user_id': str(post.user.username),
                'iconimage': circleci.MEDIA_URL + str(post.user.iconimage),
                'question': post.question,
                'created_at': created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
                'voted': True,
                'selected_num': 0,
                'total': total,
                'options': options_list
            }]
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_own_posted_posts_success(self):
        """ユーザーモデルの投稿済みの投稿一覧取得APIへのGETリクエスト(正常系:投稿一覧を投稿者が見る場合)"""

        # 投稿用ユーザーでログイン→投稿
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.post_params, format='json')

        # 投票用ユーザーでログイン→投票
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        post = Post.objects.get()
        self.client.post('/api/v1/posts/{}/polls/'.format(post.id), self.vote_params, format='json')

        # もう一度投稿用ユーザーでログイン
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # 自分自身の投稿一覧を取得
        response = self.client.get(self.TARGET_URL_WITH_PK.format(self.user1.username))
        self.assertEqual(response.status_code, 200)

        # 予期される選択肢の中身を作成
        options = Option.objects.filter(share_id=post.share_id)
        options_list = create_options_list(options)
        # 投稿日時を日本時間変更
        created_at = change_created_at(post)
        # 合計投票数を再算出
        total = Post.objects.get().total
        expected_json_dict = {
            'posts': [{
                'post_id': str(post.id),
                'user_id': str(post.user.username),
                'iconimage': circleci.MEDIA_URL + str(post.user.iconimage),
                'question': post.question,
                'created_at': created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
                'voted': True,
                'selected_num': -1,
                'total': total,
                'options': options_list
            }]
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_posted_posts_unauthorized(self):
        """ユーザーモデルの投稿済みの投稿一覧取得APIへのGETリクエスト(異常系:ヘッダーにトークンがのっていない時)"""

        # あえてヘッダーにトークンを載せない

        response = self.client.get(self.TARGET_URL_WITH_PK.format(self.user2.username))
        self.assertEqual(response.status_code, 401)

        expected_json_dict = {
            "detail": "認証情報が含まれていません。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_posted_posts_not_found(self):
        """ユーザーモデルの投稿済みの投稿一覧取得APIへのGETリクエスト(異常系:リクエストしたエンドポイントのユーザーIDが存在しない時)"""

        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        response = self.client.get(self.TARGET_URL_WITH_PK.format('user3'))
        self.assertEqual(response.status_code, 404)

        expected_json_dict = {
            'detail': '存在しないユーザーIDです'
        }
        self.assertJSONEqual(response.content, expected_json_dict)


# (正常系)2methods,(異常系)3methods,(合計)5methods.
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
            blood_type='0',
            age=24,
            born_at='1998-08-10',
        )
        cls.normal_params = {
            'question': 'あなたの推しメンは？',
            'options': [{
                'select_num': 0,
                'answer': '齋藤飛鳥'
            }, {
                'select_num': 1,
                'answer': '北野日奈子'
            }]
        }

    def test_post_options_2_success(self):
        """投稿モデルの登録APIへのPOSTリクエスト(正常系)"""

        # ログイン(JWT認証)
        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # APIリクエストを実行
        response = self.client.post(self.TARGET_URL, self.normal_params, format='json')

        # データベースの状態を検証
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(Option.objects.count(), 2)
        # レスポンスの内容を検証
        self.assertEqual(response.status_code, 201)
        expected_json_dict = {}
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_post_options_10_success(self):
        """投稿モデルの登録APIへのPOSTリクエスト(正常系)"""

        # ログイン(JWT認証)
        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # APIリクエストを実行
        params = {
            "question": "あなたの推しメンは？",
            "options": [{
                "select_num": 1,
                "answer": "齋藤飛鳥"
            }, {
                "select_num": 2,
                "answer": "北野日奈子"
            }, {
                "select_num": 3,
                "answer": "柿崎芽実"
            }, {
                "select_num": 4,
                "answer": "金村美玖"
            }, {
                "select_num": 5,
                "answer": "星野みなみ"
            }, {
                "select_num": 6,
                "answer": "東村芽依"
            }, {
                "select_num": 7,
                "answer": "河田陽菜"
            }, {
                "select_num": 8,
                "answer": "山下美月"
            }, {
                "select_num": 9,
                "answer": "与田祐希"
            }, {
                "select_num": 10,
                "answer": "渡辺みりあ"
            }]
        }
        response = self.client.post(self.TARGET_URL, params, format='json')

        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(Option.objects.count(), 10)
        self.assertEqual(response.status_code, 201)

        expected_json_dict = {}
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_post_unauthorized(self):
        """投稿モデルの登録APIへのPOSTリクエスト(異常系:リクエストのヘッダーにトークンが乗っていない時)"""

        # あえてJWT認証によるログインをしない。

        # APIリクエストを実行
        response = self.client.post(self.TARGET_URL, self.normal_params, format='json')

        self.assertEqual(Post.objects.count(), 0)
        self.assertEqual(Option.objects.count(), 0)
        self.assertEqual(response.status_code, 401)

        expected_json_dict = {
            "detail": "認証情報が含まれていません。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)
    
    def test_post_options_1_bad_request(self):
        """投稿モデルの登録APIへのPOSTリクエスト(異常系:リクエストのoptionsリストが2個未満の時)"""

        # ログイン(JWT認証)
        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # APIリクエストを実行
        params = {
            'question': 'あなたの推しメンは？',
            'options': [{
                'select_num': 0,
                'answer': '齋藤飛鳥'
            }]
        }
        response = self.client.post(self.TARGET_URL, params, format='json')

        self.assertEqual(Post.objects.count(), 0)
        self.assertEqual(Option.objects.count(), 0)
        self.assertEqual(response.status_code, 400)

        expected_json_dict = {
            "options": [{"answer": "回答は2個以上にしてください。"}]
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_post_options_11_bad_request(self):
        """投稿モデルの登録APIへのPOSTリクエスト(異常系:リクエストのoptionsリストが10個以下ではなかった時)"""

        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        params = {
            "question": "あなたの推しメンは？",
            "options": [{
                "select_num": 1,
                "answer": "齋藤飛鳥"
            }, {
                "select_num": 2,
                "answer": "北野日奈子"
            }, {
                "select_num": 3,
                "answer": "柿崎芽実"
            }, {
                "select_num": 4,
                "answer": "金村美玖"
            }, {
                "select_num": 5,
                "answer": "星野みなみ"
            }, {
                "select_num": 6,
                "answer": "東村芽依"
            }, {
                "select_num": 7,
                "answer": "河田陽菜"
            }, {
                "select_num": 8,
                "answer": "山下美月"
            }, {
                "select_num": 9,
                "answer": "与田祐希"
            }, {
                "select_num": 10,
                "answer": "渡辺みりあ"
            }, {
                "select_num": 11,
                "answer": "井口眞緒"
            }]
        }
        response = self.client.post(self.TARGET_URL, params, format='json')

        self.assertEqual(Post.objects.count(), 0)
        self.assertEqual(Option.objects.count(), 0)
        self.assertEqual(response.status_code, 400)

        expected_json_dict = {
            "options": [{"answer": "回答は10個以下にしてください。"}]
        }
        self.assertJSONEqual(response.content, expected_json_dict)


# (正常系)2methods,(異常系)0methods,(合計)2methods.
class TestPostListCreatedAPIView(APITestCase):
    """PostListCreatedAPIViewのテストクラス"""

    TARGET_URL = '/api/v1/posts/public/'

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # ユーザーを定義→作成
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
        cls.user2 = get_user_model().objects.create_user(
            email='user2@example.com',
            username='user2',
            password='secret',
            usernonamae='サンプル2',
            sex='1',
            blood_type='1',
            age=19,
            born_at='2001-12-02',
        )
        # 投稿のパラメーターを定義
        cls.post_params_1 = {
            'question': 'あなたの推しメンは？',
            'options': [{
                'select_num': 0,
                'answer': '齋藤飛鳥'
            }, {
                'select_num': 1,
                'answer': '北野日奈子'
            }]
        }
        cls.post_params_2 = {
            'question': '好きなアニメは？',
            'options': [{
                'select_num': 0,
                'answer': 'ソードアート・オンライン'
            }, {
                'select_num': 1,
                'answer': '青春ブタ野郎はバニーガール先輩の夢を見ない'
            }]
        }
        cls.vote_params_1 = {
            'option': {
                'select_num': 0
            }
        }

    def test_get_created_voted_posts_success(self):
        """PostListCreatedAPIViewの投稿一覧取得APIへのGETリクエスト(正常:投票したユーザーは投票結果を出力する)"""

        # 投稿用ユーザーでログイン→投稿
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        self.client.post('/api/v1/posts/', self.post_params_1, format='json')
        post1 = Post.objects.get()

        # 投票用ユーザーでログイン→１つの投稿にだけ投票
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/{}/polls/'.format(post1.id), self.vote_params_1, format='json')

        # 投票用ユーザーで投稿一覧をリクエスト
        response = self.client.get(self.TARGET_URL)

        # データベースの状態を検証
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(Poll.objects.count(), 1)
        # レスポンスの内容を検証
        self.assertEqual(response.status_code, 200)

        # 予期されるレスポンスを作成
        posts = Post.objects.get()
        options = Option.objects.filter(share_id=posts.share_id)
        # それぞれの選択肢を事前に定義してた関数により作成
        options_list = create_options_list(options)
        # それぞれの作成日時について日本時間へ変更
        created_at = change_created_at(posts)
        expected_json_dict = {
            'posts': [{
                'post_id': str(posts.id),
                'user_id': str(posts.user.username),
                'iconimage': circleci.MEDIA_URL + str(posts.user.iconimage),
                'question': posts.question,
                'voted': True,
                'total': 1,
                'options': options_list,
                'created_at': created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
                'selected_num': 0
            }]
        }
        self.assertJSONEqual(response.content, expected_json_dict)
    
    def test_get_created_unvoted_posts_success(self):
        """PostListCreatedAPIViewの投稿一覧取得APIへのGETリクエスト(正常:投票してないユーザーは投票結果を出力しない)"""

        # 投稿用ユーザーでログイン→投稿
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.post_params_1, format='json')

        # 別のユーザーでログイン→投稿一覧をリクエスト
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        response = self.client.get(self.TARGET_URL)

        # データベースの状態を検証
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(Poll.objects.count(), 0)
        # レスポンスの内容を検証
        self.assertEqual(response.status_code, 200)

        # 予期されるレスポンスを作成
        posts = Post.objects.get()
        options = Option.objects.filter(share_id=posts.share_id)
        # それぞれの選択肢を事前に定義してた関数により作成
        options_list = create_options_list(options)
        for options in options_list:
            options['votes'] = -1
        # それぞれの作成日時について日本時間へ変更
        created_at = change_created_at(posts)
        expected_json_dict = {
            'posts': [{
                'post_id': str(posts.id),
                'user_id': str(posts.user.username),
                'iconimage': circleci.MEDIA_URL + str(posts.user.iconimage),
                'question': posts.question,
                'voted': False,
                'total': 0,
                'options': options_list,
                'created_at': created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
                'selected_num': -1
            }]
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_created_posted_posts_success(self):
        """PostListCreatedAPIViewの投稿一覧取得APIへのGETリクエスト(正常:投稿したユーザーは投票結果を出力する)"""

        # 投稿用ユーザーでログイン→投稿
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        self.client.post('/api/v1/posts/', self.post_params_1, format='json')
        post = Post.objects.get()

        # 投票用ユーザーでログイン→１つの投稿にだけ投票
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/{}/polls/'.format(post.id), self.vote_params_1, format='json')

        # 投稿用ユーザーで再びログイン→リクエスト
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # 投稿用ユーザーで投稿一覧をリクエスト
        response = self.client.get(self.TARGET_URL)

        # データベースの状態を検証
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(Poll.objects.count(), 1)
        # レスポンスの内容を検証
        self.assertEqual(response.status_code, 200)

        # 予期されるレスポンスを作成
        posts = Post.objects.get()
        options = Option.objects.filter(share_id=posts.share_id)
        # それぞれの選択肢を事前に定義してた関数により作成
        options_list = create_options_list(options)
        # それぞれの作成日時について日本時間へ変更
        created_at = change_created_at(posts)
        expected_json_dict = {
            'posts': [{
                'post_id': str(posts.id),
                'user_id': str(posts.user.username),
                'iconimage': circleci.MEDIA_URL + str(posts.user.iconimage),
                'question': posts.question,
                'voted': True,
                'total': 1,
                'options': options_list,
                'created_at': created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
                'selected_num': -1
            }]
        }
        self.assertJSONEqual(response.content, expected_json_dict)
    

# (正常系)2methods,(異常系)1methods,(合計)3methods.
class TestPostListRankAPIView(APITestCase):
    """PostListRankAPIViewのテストクラス"""

    TARGET_URL = '/api/v1/posts/public/rank/'

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # ユーザーを定義→作成
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
        cls.user2 = get_user_model().objects.create_user(
            email='user2@example.com',
            username='user2',
            password='secret',
            usernonamae='サンプル2',
            sex='1',
            blood_type='1',
            age=19,
            born_at='2001-12-02',
        )
        # 投稿のパラメーターを定義
        cls.params1 = {
            'question': 'あなたの推しメンは？',
            'options': [{
                'select_num': 0,
                'answer': '齋藤飛鳥'
            }, {
                'select_num': 1,
                'answer': '北野日奈子'
            }]
        }
        cls.params2 = {
            'question': '好きなアニメは？',
            'options': [{
                'select_num': 0,
                'answer': 'ソードアート・オンライン'
            }, {
                'select_num': 1,
                'answer': '青春ブタ野郎はバニーガール先輩の夢を見ない'
            }]
        }

    def test_get_ranked_1_2_posts_success(self):
        """PostListRankAPIViewの投稿一覧取得APIへのGETリクエスト(正常:1位と2位の投稿を取得)"""

        # 投稿用ユーザーで2つ投稿
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        self.client.post('/api/v1/posts/', self.params1, format='json')
        post1 = Post.objects.get()
        self.client.post('/api/v1/posts/', self.params2, format='json')

        # 投票用ユーザーでログイン→１つの投稿にだけ投票
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        params = {
            'option': {
                'select_num': 0
            }
        }
        self.client.post('/api/v1/posts/{}/polls/'.format(post1.id), params, format='json')

        # 再び投稿用ユーザーでログイン→ランキングを取得
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        response = self.client.get(self.TARGET_URL)

        # データベースの状態を検証
        self.assertEqual(Post.objects.count(), 2)
        self.assertEqual(Poll.objects.count(), 1)
        # レスポンスの内容を検証
        self.assertEqual(response.status_code, 200)

        # 予期されるレスポンスを作成
        posts = Post.objects.all().order_by('created_at')
        first_options = Option.objects.filter(share_id=posts[0].share_id)
        second_options = Option.objects.filter(share_id=posts[1].share_id)
        # それぞれの選択肢を事前に定義してた関数により作成
        first_options_list = create_options_list(first_options)
        second_options_list = create_options_list(second_options)
        # それぞれの作成日時について日本時間へ変更
        first_created_at = change_created_at(posts[0])
        second_created_at = change_created_at(posts[1])
        expected_json_dict = {
            'posts': [{
                'post_id': str(posts[0].id),
                'user_id': str(posts[0].user.username),
                'iconimage': circleci.MEDIA_URL + str(posts[0].user.iconimage),
                'question': posts[0].question,
                'voted': True,
                'total': 1,
                'options': first_options_list,
                'created_at': first_created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
                'selected_num': -1,
                'rank': 0
            }, {
                'post_id': str(posts[1].id),
                'user_id': str(posts[1].user.username),
                'iconimage': circleci.MEDIA_URL + str(posts[1].user.iconimage),
                'question': posts[1].question,
                'voted': True,
                'total': 0,
                'options': second_options_list,
                'created_at': second_created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
                'selected_num': -1,
                'rank': 1
            }]
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_ranked_1_1_posts_success(self):
        """PostListRankAPIViewの投稿一覧取得APIへのGETリクエスト(正常:２つの１位の投稿を取得)"""

        # 投稿用ユーザーで2つ投稿
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # 投稿×２
        self.client.post('/api/v1/posts/', self.params1, format='json')
        self.client.post('/api/v1/posts/', self.params2, format='json')

        # ランキングを取得
        response = self.client.get(self.TARGET_URL)

        # データベースの状態を検証
        self.assertEqual(Post.objects.count(), 2)
        # レスポンスの内容を検証
        self.assertEqual(response.status_code, 200)

        # 予期されるレスポンスを作成
        posts = Post.objects.all().order_by('created_at')
        first_options = Option.objects.filter(share_id=posts[0].share_id)
        second_options = Option.objects.filter(share_id=posts[1].share_id)
        # それぞれの選択肢を事前に定義してた関数により作成
        first_options_list = create_options_list(first_options)
        second_options_list = create_options_list(second_options)
        # それぞれの作成日時について日本時間へ変更
        first_created_at = change_created_at(posts[0])
        second_created_at = change_created_at(posts[1])
        expected_json_dict = {
            'posts': [{
                'post_id': str(posts[0].id),
                'user_id': str(posts[0].user.username),
                'iconimage': circleci.MEDIA_URL + str(posts[0].user.iconimage),
                'question': posts[0].question,
                'voted': True,
                'total': 0,
                'options': first_options_list,
                'created_at': first_created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
                'selected_num': -1,
                'rank': 0
            }, {
                'post_id': str(posts[1].id),
                'user_id': str(posts[1].user.username),
                'iconimage': circleci.MEDIA_URL + str(posts[1].user.iconimage),
                'question': posts[1].question,
                'voted': True,
                'total': 0,
                'options': second_options_list,
                'created_at': second_created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
                'selected_num': -1,
                'rank': 0
            }]
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_ranked_posts_unauthorized(self):
        """ユーザーモデルの投稿済みの投稿一覧取得APIへのGETリクエスト(異常系:ヘッダーにトークンがのっていない時)"""

        # あえてヘッダーにトークンを載せない

        response = self.client.get(self.TARGET_URL)
        self.assertEqual(response.status_code, 401)

        expected_json_dict = {
            "detail": "認証情報が含まれていません。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)


# (正常系)1method,(異常系)2methods,(合計)3methods.
class TestPostDeleteAPIView(APITestCase):
    """PostDetailDeleteAPIViewのテストクラス"""

    TARGET_URL_WITH_PK = '/api/v1/posts/{}/'

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = get_user_model().objects.create_user(
            email='user@example.com',
            username='user',
            password='secret',
            usernonamae='サンプル',
            sex='0',
            blood_type='0',
            age=21,
            born_at='1998-08-10',
        )
        cls.params = {
            'question': 'あなたの推しメンは？',
            'options': [{
                'select_num': 0,
                'answer': '齋藤飛鳥'
            }, {
                'select_num': 1,
                'answer': '北野日奈子'
            }]
        }

    def test_delete_posts_success(self):
        """投稿モデルの削除APIへのDELETEリクエスト(正常系)"""

        # ログイン→投稿API
        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.params, format='json')

        # 投稿を取得→削除API
        post = Post.objects.get()
        response = self.client.delete(self.TARGET_URL_WITH_PK.format(post.id))

        self.assertEqual(Post.objects.count(), 0)
        self.assertEqual(response.status_code, 204)

    def test_delete_posts_unauthorized(self):
        """投稿モデルの削除APIへのDELETEリクエスト(異常系:ヘッダーにトークンがのっていない時)"""

        # 投稿用でログイン→投稿API
        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.params, format='json')

        # ヘッダーからトークンを消す
        self.client.credentials()

        # 投稿を取得→削除API
        post = Post.objects.get()
        response = self.client.delete(self.TARGET_URL_WITH_PK.format(post.id))

        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(response.status_code, 401)

        expected_json_dict = {
            "detail": "認証情報が含まれていません。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_delete_posts_bad_request(self):
        """投稿モデルの削除APIへのDELETEリクエスト(異常系:投稿を削除命令したが、その投稿IDが存在しない時)"""

        # 投稿用でログイン→投稿API
        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.params, format='json')

        # 存在しないUUIDで削除API
        changed_pid = str(uuid.uuid4())
        response = self.client.delete(self.TARGET_URL_WITH_PK.format(changed_pid))

        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(response.status_code, 404)

        expected_json_dict = {
            "detail": "存在しない投稿IDです。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)


# (正常系)3methods,(異常系)2methods,(合計)5methods.
class TestPostUpdateAPIView(APITestCase):
    """PostUpdateAPIViewのテストクラス"""

    TARGET_URL_WITH_PK = '/api/v1/posts/public/{}/'

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
        cls.user2 = get_user_model().objects.create_user(
            email='user2@example.com',
            username='user2',
            password='secret',
            usernonamae='サンプル2',
            sex='1',
            blood_type='1',
            age=19,
            born_at='2001-12-02',
        )
        cls.post_params = {
            'question': 'あなたの推しメンは？',
            'options': [{
                'select_num': 0,
                'answer': '齋藤飛鳥'
            }, {
                'select_num': 1,
                'answer': '北野日奈子'
            }]
        }
        cls.vote_params = {
            'option': {
                'select_num': 0
            }
        }

    def test_get_update_posts_voted_success(self):
        """投稿モデルの投票情報更新APIへのGETリクエスト(正常系:投票済みユーザーなら投票結果閲覧可)"""

        # 投稿用のユーザーがログイン→投稿
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.post_params, format='json')

        # 投票用のユーザーがログイン→投票
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        post = Post.objects.get()
        self.client.post('/api/v1/posts/{}/polls/'.format(post.id), self.vote_params, format='json')

        # 投稿の情報を取得
        response = self.client.get(self.TARGET_URL_WITH_PK.format(post.id))
        self.assertEqual(response.status_code, 200)
        
        # 予期されるレスポンスを作成
        options = Option.objects.filter(share_id=post.share_id)
        options_list = create_options_list(options)
        created_at = change_created_at(post)
        expected_json_dict = {
            'post_id': str(post.id),
            'user_id': str(post.user.username),
            'iconimage': circleci.MEDIA_URL + str(post.user.iconimage),
            'question': post.question,
            'created_at': created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
            'voted': True,
            'selected_num': 0,
            'total': 1,
            'options': options_list
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_update_posts_posted_success(self):
        """投稿モデルの投票情報更新APIへのGETリクエスト(正常系:投稿ユーザーなら投票結果閲覧可。ただしselected_numは-1)"""

        # 投稿用のユーザーがログイン→投稿
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.post_params, format='json')

        # 投票用のユーザーがログイン→投票
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        post = Post.objects.get()
        self.client.post('/api/v1/posts/{}/polls/'.format(post.id), self.vote_params, format='json')

        # 再び投稿用のユーザーでログイン
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # 投稿の情報を取得
        response = self.client.get(self.TARGET_URL_WITH_PK.format(post.id))
        self.assertEqual(response.status_code, 200)
        
        # 予期されるレスポンスを作成
        options = Option.objects.filter(share_id=post.share_id)
        options_list = create_options_list(options)
        created_at = change_created_at(post)
        expected_json_dict = {
            'post_id': str(post.id),
            'user_id': str(post.user.username),
            'iconimage': circleci.MEDIA_URL + str(post.user.iconimage),
            'question': post.question,
            'created_at': created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
            'voted': True,
            'selected_num': -1,
            'total': 1,
            'options': options_list
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_update_posts_no_voted_success(self):
        """投稿モデルの投票情報更新APIへのGETリクエスト(正常系:投票していないユーザーは投票結果閲覧不可)"""

        # 投稿用のユーザーがログイン→投稿
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.post_params, format='json')
        
        # 他ユーザーにてログイン→投稿情報更新
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        
        post = Post.objects.get()
        response = self.client.get(self.TARGET_URL_WITH_PK.format(post.id))
        self.assertEqual(response.status_code, 200)
        
        # 予期されるレスポンスを作成
        options = Option.objects.filter(share_id=post.share_id)
        options_list = create_options_list(options)
        # 投票していないとvotesで-1を返す
        for options in options_list:
            options['votes'] = -1
        created_at = change_created_at(post)
        expected_json_dict = {
            'post_id': str(post.id),
            'user_id': str(post.user.username),
            'iconimage': circleci.MEDIA_URL + str(post.user.iconimage),
            'question': post.question,
            'created_at': created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
            'voted': False,
            'selected_num': -1,
            'total': 0,
            'options': options_list
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_update_posts_unauthorized(self):
        """投稿モデルの投票情報更新APIへのGETリクエスト(異常系:ヘッダーにトークンがのっていない時)"""

        # 投稿用だけログイン
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.post_params, format='json')

        # 認証用のヘッダーを消去する
        self.client.credentials()

        post = Post.objects.get()
        response = self.client.get(self.TARGET_URL_WITH_PK.format(post.id))
        self.assertEqual(response.status_code, 401)

        expected_json_dict = {
            "detail": "認証情報が含まれていません。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)
    
    def test_get_update_posts_not_found(self):
        """投稿モデルの投票情報更新APIへのGETリクエスト(異常系:投稿に投票したが投稿IDが存在しない時)"""

        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.post_params, format='json')

        changed_pid = str(uuid.uuid4())
        response = self.client.get(self.TARGET_URL_WITH_PK.format(changed_pid))
        self.assertEqual(response.status_code, 404)

        expected_json_dict = {
            "detail": "存在しない投稿IDです。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)


# (正常系)1method,(異常系)3methods,(合計)4methods.
class TestPollCreateAPIView(APITestCase):
    """PollCreateAPIViewのテストクラス"""

    TARGET_URL_WITH_PK = '/api/v1/posts/{}/polls/'

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
        cls.user2 = get_user_model().objects.create_user(
            email='user2@example.com',
            username='user2',
            password='secret',
            usernonamae='サンプル2',
            sex='1',
            blood_type='1',
            age=19,
            born_at='2001-12-02',
        )
        cls.post_params = {
            'question': 'あなたの推しメンは？',
            'options': [{
                'select_num': 0,
                'answer': '齋藤飛鳥'
            }, {
                'select_num': 1,
                'answer': '北野日奈子'
            }]
        }
        cls.vote_params = {
            'option': {
                'select_num': 0
            }
        }
    
    def test_post_poll_other_success(self):
        """投票モデルの登録APIへのPOSTリクエスト(正常系)"""

        # 投稿用のユーザーがログイン→投稿のPOSTAPI
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.post_params, format='json')

        # 投票用のユーザーがログイン→投票のPOSTAPI
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        post = Post.objects.get()
        response = self.client.post(self.TARGET_URL_WITH_PK.format(post.id), self.vote_params, format='json')

        # データベースの状態を検証
        self.assertEqual(Poll.objects.count(), 1)
        self.assertEqual(response.status_code, 201)

        # レスポンスの内容を検証
        options = Option.objects.all()
        options_list = create_options_list(options)
        # 投票時のレスポンスではanswerを返さない
        for options in options_list:
            del options['answer']
        # 投票後の合計投票数を取得
        total = Post.objects.get().total
        expected_json_dict = {
            'options': options_list,
            'total': total,
            'selected_num': Poll.objects.get().option.select_num
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_post_unauthorized(self):
        """投票モデルの登録APIへのPOSTリクエスト(異常系:ヘッダーにトークンがのっていない時)"""

        # 投稿用だけログイン→投稿のPOSTAPI
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.post_params, format='json')

        # 認証用のヘッダーを消去する
        self.client.credentials()

        # 投票のPOSTAPI
        post = Post.objects.get()
        response = self.client.post(self.TARGET_URL_WITH_PK.format(post.id), self.vote_params, format='json')

        self.assertEqual(Poll.objects.count(), 0)
        self.assertEqual(response.status_code, 401)

        expected_json_dict = {
            "detail": "認証情報が含まれていません。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_post_poll_other_postid_not_found(self):
        """投票モデルの登録APIへのPOSTリクエスト(異常系:投稿に投票したが投稿IDが存在しない時)"""

        # 投稿用のユーザーがログイン→投稿のPOSTAPI
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.post_params, format='json')
        
        # 投票用のユーザーでログイン→投票のPOSTAPI
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        changed_pid = str(uuid.uuid4())
        response = self.client.post(self.TARGET_URL_WITH_PK.format(changed_pid), self.vote_params, format='json')

        self.assertEqual(Poll.objects.count(), 0)
        self.assertEqual(response.status_code, 404)

        expected_json_dict = {
            "detail": "存在しない投稿IDです。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_post_poll_other_selectnum_not_found(self):
        """投票モデルの登録APIへのPOSTリクエスト(異常系:他人の投稿に投票したが選択肢が存在しない時)"""

        # 投稿用のユーザーがログイン→投稿のPOSTメソッドAPI
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.client.post('/api/v1/posts/', self.post_params, format='json')
        
        # 投票用のユーザーにログイン→存在しない選択肢で投票のPOSTメソッドAPI
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        post = Post.objects.get()
        params = {
            'option': {
                'select_num': 2
            }
        }
        response = self.client.post(self.TARGET_URL_WITH_PK.format(post.id), params, format='json')

        self.assertEqual(Poll.objects.count(), 0)
        self.assertEqual(response.status_code, 404)

        expected_json_dict = {
            "detail": "存在しない選択肢です。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)
