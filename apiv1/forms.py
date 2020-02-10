from django import forms
from .models import Mypage

class MypageForm(forms.ModelForm):
    """マイページ自動作成機能実装にあたり、is_valid()を使用するために作成"""

    class Meta:
        model = Mypage
        fields = ['user', 'introduction', 'homeimage']