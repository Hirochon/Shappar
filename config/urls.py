from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from . import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('home/', views.sent_email, name='home'),
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
    path('accounts/', include('accounts.urls')),
    path('api/v1/', include('apiv1.urls')),
    re_path(r'^mypage/.*', TemplateView.as_view(template_name='index.html'), name='index'),
]
