from django.urls import include, path
from .views import MypageAPIView, PollCreateAPIView, PostCreateAPIView, PollRetrieveAPIView

app_name = 'apiv1'
urlpatterns = [
    path('users/<pk>/', MypageAPIView.as_view()),
    path('posts/', PostCreateAPIView.as_view()),
    path('posts/public/', PollRetrieveAPIView.as_view()),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.urls')),
]