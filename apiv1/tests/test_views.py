import uuid
from datetime import datetime,timedelta,timezone
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
            age=24,
            born_at='1998-08-10',
        )

    def test_post_options_2_success(self):
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
        self.assertEqual(Option.objects.count(), 2)
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

    def test_post_options_10_success(self):
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
        self.assertEqual(Option.objects.count(), 10)
        self.assertEqual(response.status_code, 201)

        expected_json_dict = {}
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_post_unauthorized(self):
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
            'question':'あなたの推しメンは？',
            'options':[{
                'select_num':0,
                'answer':'齋藤飛鳥'
            }]
        }
        response = self.client.post(self.TARGET_URL, params, format='json')

        self.assertEqual(Post.objects.count(), 0)
        self.assertEqual(Option.objects.count(), 0)
        self.assertEqual(response.status_code, 400)

        expected_json_dict = {
            "options":[{"answer":"回答は2個以上にしてください。"}]
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_post_options_11_bad_request(self):
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
        self.assertEqual(Option.objects.count(), 0)
        self.assertEqual(response.status_code, 400)

        expected_json_dict = {
            "options":[{"answer":"回答は10個以下にしてください。"}]
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
            age=21,
            born_at='1998-08-10',
        )

    def test_delete_posts_success(self):
        """投稿モデルの削除APIへのDELETEリクエスト(正常系)"""

        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

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
        self.client.post('/api/v1/posts/', params, format='json')

        post = Post.objects.get()
        response = self.client.delete(self.TARGET_URL_WITH_PK.format(post.id))

        self.assertEqual(Post.objects.count(), 0)
        self.assertEqual(response.status_code, 204)

    def test_delete_posts_unauthorized(self):
        """投稿モデルの削除APIへのDELETEリクエスト(異常系:ヘッダーにトークンがのっていない時)"""

        # 投稿用でログイン
        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

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
        self.client.post('/api/v1/posts/', params, format='json')

        # ヘッダーからトークンを消す
        self.client.credentials()

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

        # 投稿用でログイン
        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

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
        self.client.post('/api/v1/posts/', params, format='json')

        changed_pid = str(uuid.uuid4())
        post = Post.objects.get()
        response = self.client.delete(self.TARGET_URL_WITH_PK.format(changed_pid))

        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(response.status_code, 404)

        expected_json_dict = {
            "detail":"存在しない投稿IDです。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)


# (正常系)3methods,(異常系)methods,(合計)methods.
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

    def test_get_update_posts_voted_success(self):
        """投稿モデルの投票情報更新APIへのGETリクエスト(正常系:投票済みユーザーなら投票結果閲覧可)"""

        # 投稿用のユーザーがログイン→投稿
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
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
        self.client.post('/api/v1/posts/', params, format='json')
        # 投票用のユーザーがログイン→投票
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        post = Post.objects.get()
        params = {
            'option':{
                'select_num':0
            }
        }
        self.client.post('/api/v1/posts/{}/polls/'.format(post.id), params, format='json')

        # 投稿の情報を取得
        response = self.client.get(self.TARGET_URL_WITH_PK.format(post.id))
        self.assertEqual(response.status_code, 200)
        
        flag = Option.objects.filter(poll_option__user_id=self.user2.id, share_id=post.share_id)
        if len(flag) > 0:
            voted = True
            selected_num = flag[0].select_num
        else: 
            voted = False
        options = Option.objects.filter(share_id=post.share_id)
        options_list = []
        for option in options:
            option_dict = {}
            option_dict['select_num'] = option.select_num
            option_dict['answer'] = option.answer
            option_dict['votes'] = option.votes
            options_list.append(option_dict)
        post_created_at = str(post.created_at)
        hours = timedelta(hours=9)
        utc_created_at = datetime.strptime(post_created_at, '%Y-%m-%d %H:%M:%S.%f%z')
        created_at = utc_created_at + hours
        expected_json_dict = {
            'post_id':str(post.id),
            'user_id':str(post.user.username),
            'iconimage':circleci.MEDIA_URL + str(post.user.iconimage),
            'question':post.question,
            'created_at':created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
            'voted':voted,
            'selected_num':selected_num,
            'total':1,
            'options':options_list
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_update_posts_posted_success(self):
        """投稿モデルの投票情報更新APIへのGETリクエスト(正常系:投稿ユーザーなら投票結果閲覧可。ただしselected_numは-1)"""

        # 投稿用のユーザーがログイン→投稿
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
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
        self.client.post('/api/v1/posts/', params, format='json')
        # 投票用のユーザーがログイン→投票
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        post = Post.objects.get()
        params = {
            'option':{
                'select_num':0
            }
        }
        self.client.post('/api/v1/posts/{}/polls/'.format(post.id), params, format='json')

        # 再び投稿用のユーザーでログイン
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        # 投稿の情報を取得
        response = self.client.get(self.TARGET_URL_WITH_PK.format(post.id))
        self.assertEqual(response.status_code, 200)
        
        options = Option.objects.filter(share_id=post.share_id)
        options_list = []
        for option in options:
            option_dict = {}
            option_dict['select_num'] = option.select_num
            option_dict['answer'] = option.answer
            option_dict['votes'] = option.votes
            options_list.append(option_dict)
        post_created_at = str(post.created_at)
        hours = timedelta(hours=9)
        utc_created_at = datetime.strptime(post_created_at, '%Y-%m-%d %H:%M:%S.%f%z')
        created_at = utc_created_at + hours
        expected_json_dict = {
            'post_id':str(post.id),
            'user_id':str(post.user.username),
            'iconimage':circleci.MEDIA_URL + str(post.user.iconimage),
            'question':post.question,
            'created_at':created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
            'voted':True,
            'selected_num':-1,
            'total':1,
            'options':options_list
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_update_posts_no_voted_success(self):
        """投稿モデルの投票情報更新APIへのGETリクエスト(正常系:投票していないユーザーは投票結果閲覧不可)"""

        # 投稿用のユーザーがログイン→投稿
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
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
        self.client.post('/api/v1/posts/', params, format='json')
        
        # 他ユーザーにてログイン→投稿情報更新
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        
        post = Post.objects.get()
        response = self.client.get(self.TARGET_URL_WITH_PK.format(post.id))
        self.assertEqual(response.status_code, 200)
        
        options = Option.objects.filter(share_id=post.share_id)
        options_list = []
        for option in options:
            option_dict = {}
            option_dict['select_num'] = option.select_num
            option_dict['answer'] = option.answer
            option_dict['votes'] = -1
            options_list.append(option_dict)
        post_created_at = str(post.created_at)
        hours = timedelta(hours=9)
        utc_created_at = datetime.strptime(post_created_at, '%Y-%m-%d %H:%M:%S.%f%z')
        created_at = utc_created_at + hours
        expected_json_dict = {
            'post_id':str(post.id),
            'user_id':str(post.user.username),
            'iconimage':circleci.MEDIA_URL + str(post.user.iconimage),
            'question':post.question,
            'created_at':created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
            'voted':False,
            'selected_num':-1,
            'total':0,
            'options':options_list
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_get_update_posts_unauthorized(self):
        """投稿モデルの投票情報更新APIへのGETリクエスト(異常系:ヘッダーにトークンがのっていない時)"""

        # 投稿用だけログイン
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

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
        self.client.post('/api/v1/posts/', params, format='json')

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

        # 投稿用のユーザーがログイン
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

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
        self.client.post('/api/v1/posts/', params, format='json')
        
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        changed_pid = str(uuid.uuid4())
        response = self.client.get(self.TARGET_URL_WITH_PK.format(changed_pid))
        self.assertEqual(response.status_code, 404)

        expected_json_dict = {
            "detail":"存在しない投稿IDです。"
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
    
    def test_post_poll_other_success(self):
        """投票モデルの登録APIへのPOSTリクエスト(正常系)"""

        # 投稿用のユーザーがログイン
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

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
        self.client.post('/api/v1/posts/', params, format='json')

        # 投票POST用のテストなので下記はコメントアウト
        # response = self.client.post('/api/v1/posts/', params, format='json')
        # self.assertEqual(Post.objects.count(), 1)
        # self.assertEqual(Option.objects.count(), 2)
        # self.assertEqual(response.status_code, 201)

        # 投票用のユーザーがログイン
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        post = Post.objects.get()
        params = {
            'option':{
                'select_num':0
            }
        }
        response = self.client.post(self.TARGET_URL_WITH_PK.format(post.id), params, format='json')

        self.assertEqual(Poll.objects.count(), 1)
        self.assertEqual(response.status_code, 201)

        options = Option.objects.all()
        options_list = []
        for option in options:
            option_dict = {}
            option_dict['select_num'] = option.select_num
            option_dict['votes'] = option.votes
            options_list.append(option_dict)
        expected_json_dict = {
            'options':options_list,
            'selected_num':Poll.objects.get().option.select_num
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_post_unauthorized(self):
        """投票モデルの登録APIへのPOSTリクエスト(異常系:ヘッダーにトークンがのっていない時)"""

        # 投稿用だけログイン
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

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
        self.client.post('/api/v1/posts/', params, format='json')

        # 認証用のヘッダーを消去する
        self.client.credentials()

        post = Post.objects.get()
        params = {
            'option':{
                'select_num':0
            }
        }
        response = self.client.post(self.TARGET_URL_WITH_PK.format(post.id), params, format='json')

        self.assertEqual(Poll.objects.count(), 0)
        self.assertEqual(response.status_code, 401)

        expected_json_dict = {
            "detail": "認証情報が含まれていません。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_post_poll_other_postid_not_found(self):
        """投票モデルの登録APIへのPOSTリクエスト(異常系:投稿に投票したが投稿IDが存在しない時)"""

        # 投稿用のユーザーがログイン
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

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
        self.client.post('/api/v1/posts/', params, format='json')
        
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        changed_pid = str(uuid.uuid4())
        params = {
            'option':{
                'select_num':0
            }
        }
        response = self.client.post(self.TARGET_URL_WITH_PK.format(changed_pid), params, format='json')

        self.assertEqual(Poll.objects.count(), 0)
        self.assertEqual(response.status_code, 404)

        expected_json_dict = {
            "detail":"存在しない投稿IDです。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)

    def test_post_poll_other_selectnum_not_found(self):
        """投票モデルの登録APIへのPOSTリクエスト(異常系:他人の投稿に投票したが選択肢が存在しない時)"""

        # 投稿用のユーザーがログイン
        token = str(RefreshToken.for_user(self.user1).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

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
        self.client.post('/api/v1/posts/', params, format='json')
        
        token = str(RefreshToken.for_user(self.user2).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)

        post = Post.objects.get()
        params = {
            'option':{
                'select_num':2
            }
        }
        response = self.client.post(self.TARGET_URL_WITH_PK.format(post.id), params, format='json')

        self.assertEqual(Poll.objects.count(), 0)
        self.assertEqual(response.status_code, 404)

        expected_json_dict = {
            "detail":"存在しない選択肢です。"
        }
        self.assertJSONEqual(response.content, expected_json_dict)