import requests

from django.core.files.base import ContentFile

from allauth.account.adapter import DefaultAccountAdapter
from allauth.account.adapter import get_adapter as get_account_adapter
from allauth.account.utils import user_email, user_field


class CustomAccountAdapter(DefaultAccountAdapter):
    """アカウントユーザのアダプタクラス"""

    def save_user(self, request, user, form, commit=True):
        """allauthのsave_userを再定義→ユーザ保存時の処理を追加"""

        data = form.cleaned_data
        username = data.get('username')
        email = data.get('email')
        user.usernonamae = data.get('usernonamae')
        user.sex = data.get('sex')
        user.age = data.get('age')
        user.blood_type = data.get('blood_type')
        user.born_at = data.get('born_at')
        user.introduction = data.get('introduction')

        # django-allauth/allauth/account/utils.pyのuser_fieldを使用
        user_field(user, 'username', username)
        user_email(user, email)

        if 'password1' in data:
            user.set_password(data.get('password1'))
        else:
            user.set_unusable_password()
        self.populate_username(request, user)
        if commit:
            user.save()
        return user