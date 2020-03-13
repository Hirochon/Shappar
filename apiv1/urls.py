from django.urls import include, path
from .views import MypageAPIView, PollCreateAPIView, PostCreateAPIView, PostListAPIView, PostUpdateAPIView

app_name = 'apiv1'
urlpatterns = [
    path('users/<pk>/', MypageAPIView.as_view()),
    path('posts/', PostCreateAPIView.as_view()),
    path('posts/public/<pk>/', PostListAPIView.as_view()),
    path('posts/public/<pk>/<sk>/', PostUpdateAPIView.as_view()),
    path('posts/<pk>/polls/', PollCreateAPIView.as_view()),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.urls')),
]