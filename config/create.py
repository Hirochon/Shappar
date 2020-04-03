from django.contrib.auth import get_user_model
# from apiv1.models import Poll, Post, Option
from random import randint
from datetime import date


def create_user(num1, num2):
    """自動ユーザー作成関数"""

    # 例外処理
    if num1 < 0:
        return "Error: 引数は０以上にしてください"
    if num1 >= num2:
        return "Error: 引数はnum1 < num2としてください。"
    user1 = 'user' + str(num1)
    user2 = 'user' + str(num2)
    users1 = get_user_model().objects.filter(username=user1)
    users2 = get_user_model().objects.filter(username=user2)
    if (len(users1) > 0) or (len(users2) > 0):
        return "Error: 重複しているユーザーがあります"

    # ユーザー作成
    for i in range(num1, num2 + 1):
        age = randint(0, 70)
        get_user_model().objects.create_user(
            email='user' + str(i) + '@example.com',
            username='user' + str(i),
            password='secret' + str(i),
            usernonamae='サンプル' + str(i),
            sex=str(i % 4),
            blood_type=str(i % 5),
            age=age,
            born_at=date(2020 - age, randint(1, 12), randint(1, 30)).isoformat(),
        )
