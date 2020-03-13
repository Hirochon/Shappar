from django.contrib import admin

from .models import Post, Poll, Option


class CustomOptionAdmin(admin.ModelAdmin):
    """Optionの管理画面の表示する項目を設定"""

    list_display = ('id', 'share_id', 'select_num','answer', 'votes')
    readonly_fields = ('id','share_id','select_num')
    fields = ('id', 'share_id', 'select_num','answer', 'votes')

class CustomPostAdmin(admin.ModelAdmin):
    """Postの管理画面の表示する項目を設定"""

    list_display = ('id', 'question', 'user', 'share_id')
    readonly_fields = ('id', 'share_id','created_at')
    fields = ('id', 'question', 'share_id','created_at')


class CustomPollAdmin(admin.ModelAdmin):
    """Optionの管理画面の表示する項目を設定"""

    list_display = ('id','user','post','option')
    readonly_fields = ('id',)
    fields = ('id','user','post','option')

admin.site.register(Option, CustomOptionAdmin)
admin.site.register(Post, CustomPostAdmin)
admin.site.register(Poll, CustomPollAdmin)