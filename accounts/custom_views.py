from django.contrib import messages
from django.contrib.sites.shortcuts import get_current_site
from django.http import Http404
# from django.shortcuts import redirect
from django.views.generic.base import TemplateResponseMixin, View
from django.core.paginator import Paginator
from django.contrib.auth import get_user_model
from django.shortcuts import render
from .forms import CreateUserForm
from config.create import CreateUser
# from django.contrib.auth import logout

from allauth.account import app_settings
from allauth.account.adapter import get_adapter
from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC
from allauth.account.utils import perform_login, url_str_to_user_pk


class CreateUserView(View):
    """ユーザー自動作成機能"""

    def get(self, request, num=1, *args, **kwargs):
        if not request.user.is_staff:
            params = {'message': 'アクセスの権限がありません。'}
            return render(request, 'errors/403.html', params)

        users = get_user_model().objects.all().order_by('-created_at')
        count = get_user_model().objects.count()
        if count < 10:
            page = Paginator(users, count)
        page = Paginator(users, 10)
        params = {
            'users': page.get_page(num),
            'form': CreateUserForm()
        }
        return render(request, 'account/create_user.html', params)

    def post(self, request, *args, **kwargs):
        # 権限チェック
        if not request.user.is_superuser:
            users = get_user_model().objects.all().order_by('-created_at')
            count = get_user_model().objects.count()
            if count < 10:
                page = Paginator(users, count)
            page = Paginator(users, 10)
            params = {
                'users': page.get_page(1),
                'form': CreateUserForm(),
                'message': 'Error: 権限がありません'
            }
            return render(request, 'account/create_user.html', params)

        num1 = request.POST['num1']
        num2 = request.POST['num2']
        createuser = CreateUser(num1, num2)
        message = createuser.create()

        users = get_user_model().objects.all().order_by('-created_at')
        count = get_user_model().objects.count()
        if count < 10:
            page = Paginator(users, count)
        page = Paginator(users, 10)
        params = {
            'users': page.get_page(1),
            'form': CreateUserForm(),
            'message': message
        }

        return render(request, 'account/create_user.html', params)


create_user = CreateUserView.as_view()


class ConfirmEmailView(TemplateResponseMixin, View):

    template_name = "account/email_confirm." + app_settings.TEMPLATE_EXTENSION

    def get(self, *args, **kwargs):
        try:
            self.object = self.get_object()
            if app_settings.CONFIRM_EMAIL_ON_GET:
                return self.post(*args, **kwargs)
        except Http404:
            self.object = None
        ctx = self.get_context_data()
        return self.render_to_response(ctx)

    def post(self, request, *args, **kwargs):
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
        # redirect_url = self.get_redirect_url()
        # if not redirect_url:
        #     ctx = self.get_context_data()
        #     return self.render_to_response(ctx)
        return render(request, 'account/custom_email_confirmed.html')

    def login_on_confirm(self, confirmation):
        """
        Simply logging in the user may become a security issue. If you
        do not take proper care (e.g. don't purge used email
        confirmations), a malicious person that got hold of the link
        will be able to login over and over again and the user is
        unable to do anything about it. Even restoring their own mailbox
        security will not help, as the links will still work. For
        password reset this is different, this mechanism works only as
        long as the attacker has access to the mailbox. If they no
        longer has access they cannot issue a password request and
        intercept it. Furthermore, all places where the links are
        listed (log files, but even Google Analytics) all of a sudden
        need to be secured. Purging the email confirmation once
        confirmed changes the behavior -- users will not be able to
        repeatedly confirm (in case they forgot that they already
        clicked the mail).

        All in all, opted for storing the user that is in the process
        of signing up in the session to avoid all of the above.  This
        may not 100% work in case the user closes the browser (and the
        session gets lost), but at least we're secure.
        """
        user_pk = None
        user_pk_str = get_adapter(self.request).unstash_user(self.request)
        if user_pk_str:
            user_pk = url_str_to_user_pk(user_pk_str)
        user = confirmation.email_address.user
        if user_pk == user.pk and self.request.user.is_anonymous:
            return perform_login(
                self.request,
                user,
                app_settings.EmailVerificationMethod.NONE,
                # passed as callable, as this method
                # depends on the authenticated state
                redirect_url=self.get_redirect_url
                )

        return None

    def get_object(self, queryset=None):
        key = self.kwargs['key']
        emailconfirmation = EmailConfirmationHMAC.from_key(key)
        if not emailconfirmation:
            if queryset is None:
                queryset = self.get_queryset()
            try:
                emailconfirmation = queryset.get(key=key.lower())
            except EmailConfirmation.DoesNotExist:
                raise Http404()
        return emailconfirmation

    def get_queryset(self):
        qs = EmailConfirmation.objects.all_valid()
        qs = qs.select_related("email_address__user")
        return qs

    def get_context_data(self, **kwargs):
        ctx = kwargs
        ctx["confirmation"] = self.object
        site = get_current_site(self.request)
        ctx.update({'site': site})
        return ctx

    def get_redirect_url(self):
        return get_adapter(self.request).get_email_confirmation_redirect_url(
            self.request)


confirm_email = ConfirmEmailView.as_view()
