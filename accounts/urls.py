from django.urls import path, re_path
from allauth.account import views
from . import custom_views

"""allauthのルーティング設定をすべて記述することによって
     パッケージのviewsを部分的にイジることができる。"""

urlpatterns = [
     path("signup/", views.signup, name="account_signup"),
     path("login/", views.login, name="account_login"),
     path("logout/", views.logout, name="account_logout"),
     path("password/change/", views.password_change,
          name="account_change_password"),
     path("password/set/", views.password_set, name="account_set_password"),
     path("inactive/", views.account_inactive, name="account_inactive"),

     # E-mail confirm_emailについて参照先を変更
     path("email/", views.email, name="account_email"),
     path("confirm-email/", views.email_verification_sent,
          name="account_email_verification_sent"),
     re_path(r"^confirm-email/(?P<key>[-:\w]+)/$", custom_views.confirm_email,
               name="account_confirm_email"),

     # password reset
     path("password/reset/", views.password_reset,
          name="account_reset_password"),
     path("password/reset/done/", views.password_reset_done,
          name="account_reset_password_done"),
     re_path(r"^password/reset/key/(?P<uidb36>[0-9A-Za-z]+)-(?P<key>.+)/$",
               views.password_reset_from_key,
               name="account_reset_password_from_key"),
     path("password/reset/key/done/", views.password_reset_from_key_done,
          name="account_reset_password_from_key_done"),
     path("create_user/", custom_views.create_user, name='create_user'),
     path("create_user/<int:num>", custom_views.create_user, name='create_user'),
]
