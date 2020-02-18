from django.contrib import admin

from .models import Post, Poll, Option


class CustomOptionAdmin(admin.ModelAdmin):
    """Optionの管理画面の表示する項目を設定"""

    list_display = ('answer', 'votes')
    fields = ('select_num', 'answer', 'votes')

class CustomPostAdmin(admin.ModelAdmin):
    """Optionの管理画面の表示する項目を設定"""

    list_display = ('id', 'question', 'user')
    readonly_fields = ('id','created_at')
    fields = ('id', 'question', 'created_at')
    

admin.site.register(Option, CustomOptionAdmin)
admin.site.register(Post, CustomPostAdmin)
admin.site.register(Poll)