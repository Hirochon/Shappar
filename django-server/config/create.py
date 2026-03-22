from django.contrib.auth import get_user_model
# from apiv1.models import Poll, Post, Option
from random import randint
from datetime import date


class CreateUser():
    """自動ユーザー作成関数"""

    def __init__(self, num1, num2):
        self.num1 = int(num1)
        self.num2 = int(num2)

    def create(self):
        # 例外処理
        if self.num1 < 0:
            return "Error: 引数は０以上にしてください"
        if self.num1 >= self.num2:
            return "Error: 引数はnum1 < num2としてください。"
        user1 = 'sample' + str(self.num1)
        user2 = 'sample' + str(self.num2)
        users1 = get_user_model().objects.filter(username=user1)
        users2 = get_user_model().objects.filter(username=user2)
        if (len(users1) > 0) or (len(users2) > 0):
            return "Error: 重複しているユーザーがあります"

        # ユーザー作成
        for i in range(self.num1, self.num2 + 1):
            age = randint(0, 70)
            get_user_model().objects.create_user(
                email='sample' + str(i) + '@example.com',
                username='sample' + str(i),
                password='shappar' + str(i),
                usernonamae='サンプル' + str(i),
                sex=str(i % 4),
                blood_type=str(i % 5),
                age=age,
                born_at=date(2020 - age, randint(1, 12), randint(1, 30)).isoformat(),
                introduction='じこしょうかいだよん@' + str(i) + '号',
            )
        return "Success!!"
