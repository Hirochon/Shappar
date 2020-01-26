from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('users', views.UserViewSet)

app_name = 'apiv1'
urlpatterns = [
    path('', include(router.urls)),
]