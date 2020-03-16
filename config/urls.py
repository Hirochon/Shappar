from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('home/', TemplateView.as_view(template_name='home.html'), name='home'),
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
    path('accounts/', include('accounts.urls')),
    path('api/v1/', include('apiv1.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)