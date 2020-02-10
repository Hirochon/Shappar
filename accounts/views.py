from django.shortcuts import render, redirect
from apiv1.models import Mypage
from apiv1.forms import MypageForm
from allauth.account.views import ConfirmEmailView
from allauth.account.adapter import get_adapter
from django.contrib import messages
from allauth.account import app_settings


class CustomConfirmEmailView(ConfirmEmailView):
    """メールアドレス本確認のallauthパッケージを継承"""

    def post(self, *args, **kwargs):
        """POST時にマイページ生成機能を追加"""
        
        user = self.request.user
        data = {}
        data['user'] = user
        mypage = MypageForm(data)
        # バリデーションで同一ユーザーのマイページの複製を回避
        if mypage.is_valid():
            mypage.save()

        self.object = confirmation = self.get_object()
        confirmation.confirm(self.request)
        get_adapter(self.request).add_message(
            self.request,
            messages.SUCCESS,
            'account/messages/email_confirmed.txt',
            {'email': confirmation.email_address.email})
        if app_settings.LOGIN_ON_EMAIL_CONFIRMATION:
            resp = self.login_on_confirm(confirmation)
            if resp is not None:
                return resp
        # Don't -- allauth doesn't touch is_active so that sys admin can
        # use it to block users et al
        #
        # user = confirmation.email_address.user
        # user.is_active = True
        # user.save()
        redirect_url = self.get_redirect_url()
        if not redirect_url:
            ctx = self.get_context_data()
            return self.render_to_response(ctx)
        return redirect(redirect_url)


confirm_email = CustomConfirmEmailView.as_view()