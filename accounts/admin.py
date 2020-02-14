from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    """管理画面の表示する項目を設定"""

    list_display = ('id', 'usernonamae', 'username', 'email', 'age', 'sex', 'is_staff')

    fieldsets = (
        (None, {'fields':('username','password')}),
        (_('Personal info'), {'fields': ('usernonamae', 'email', 'age', 'sex','born_at', 'introduction', 'iconimage', 'homeimage')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)