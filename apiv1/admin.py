from django.contrib import admin
from .models import Mypage, Post, Poll

admin.site.register(Mypage)
admin.site.register(Post)
admin.site.register(Poll)