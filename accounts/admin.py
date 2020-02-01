from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ('usernonamae', 'id', 'username','email','age','sex','is_staff')

    fieldsets = (
        (None, {'fields':('username','password')}),
        (_('Personal info'), {'fields': ('usernonamae', 'email', 'age', 'sex','born_at','iconimage')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)