from django.urls import include, path
from .views import (
    MypageAPIView,
    MypagePostedListAPIView,
    MypageVotedListAPIView,
    PollCreateAPIView,
    PostCreateAPIView,
    PostListCreatedAPIView,
    PostListRankAPIView,
    PostUpdateAPIView,
    PostDetailDeleteAPIView,
)

app_name = 'apiv1'
urlpatterns = [
    path('users/<pk>/', MypageAPIView.as_view()),
    path('users/<pk>/posted/', MypagePostedListAPIView.as_view()),
    path('users/<pk>/voted/', MypageVotedListAPIView.as_view()),
    path('posts/', PostCreateAPIView.as_view()),
    path('posts/public/', PostListCreatedAPIView.as_view()),
    path('posts/public/rank/', PostListRankAPIView.as_view()),
    path('posts/public/<pk>/', PostUpdateAPIView.as_view()),
    path('posts/<pk>/', PostDetailDeleteAPIView.as_view()),
    path('posts/<pk>/polls/', PollCreateAPIView.as_view()),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.urls')),
]