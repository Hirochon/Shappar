from allauth.account.forms import SignupForm
from django import forms
from .models import CustomUser

class MyCustomSignupForm(SignupForm):
    """サインアップ時のフォーム"""

    username = forms.CharField(label='ID', required=True, widget=forms.TextInput(attrs={'placeholder':'taro1225'}))
    usernonamae = forms.CharField(label='ユーザ名', required=True, widget=forms.TextInput(attrs={'placeholder':'太郎'}))
    email = forms.EmailField(label='メールアドレス', required=True, widget=forms.TextInput(attrs={'placeholder':'taro@example.com'}))
    sex = forms.ChoiceField(label='性別', required=True, choices=CustomUser.choice_site)
    age = forms.IntegerField(label='年齢', required=True, min_value=0, max_value=150, widget=forms.NumberInput(attrs={'placeholder': 0}))
    born_at = forms.DateField(label='生年月日', required=False, widget=forms.SelectDateWidget(years=range(1900,2021),empty_label=("年", "月", "日")))
    introduction = forms.CharField(label='自己紹介', required=False, widget=forms.Textarea(attrs={'placeholder':'はじめまして。太郎です！','cols':'30','rows':'5'}))

    def save(self, request):
        """保存する動作はアダプタークラスへ"""

        user = super(MyCustomSignupForm, self).save(request)
        return user