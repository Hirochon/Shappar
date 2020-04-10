from django.shortcuts import render
from django.views.generic.base import View


class SentEmail(View):
    """SentEmailクラス"""

    def get(self, request, *args, **kwargs):
        """サインアップ直後のメールアドレス確認促進メソッド"""
        params = {
            "email": request.user.email,
            "username": request.user.usernonamae
        }
        return render(request, 'home.html', params)


sent_email = SentEmail.as_view()
