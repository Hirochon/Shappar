from allauth.account.forms import SignupForm
from django import forms
from .models import CustomUser


class MyCustomSignupForm(SignupForm):
    """サインアップ時のフォーム"""

    # 年齢のタプルを作成
    def create_choices():
        choices_list = []
        for i in range(0, 151):
            choice = (i, i)
            choices_list.append(choice)
        choices = tuple(choices_list)
        return choices
    choices = create_choices()

    # フィールドを指定
    username = forms.CharField(label='ID', required=True, widget=forms.TextInput(attrs={'placeholder': 'taro1225'}))
    usernonamae = forms.CharField(label='ユーザ名', required=True, widget=forms.TextInput(attrs={'placeholder': '太郎'}))
    email = forms.EmailField(label='メールアドレス', required=True, widget=forms.TextInput(attrs={'placeholder': 'taro@example.com'}))
    sex = forms.ChoiceField(label='性別', required=True, choices=CustomUser.sex_choice_site)
    blood_type = forms.ChoiceField(label='血液型', required=True, choices=CustomUser.blood_type_choice_site)
    age = forms.IntegerField(label='年齢', required=True, min_value=0, max_value=150, widget=forms.NumberInput(attrs={'placeholder': 0}))
    age = forms.IntegerField(label='年齢', required=True, min_value=0, max_value=150, widget=forms.Select(choices=choices))
    born_at = forms.DateField(label='生年月日', required=True, widget=forms.SelectDateWidget(years=range(1900, 2021), empty_label=("年", "月", "日")))
    introduction = forms.CharField(label='自己紹介', required=False, widget=forms.Textarea(
        attrs={'placeholder': 'はじめまして。太郎です！', 'cols': '30', 'rows': '5'}))

    def save(self, request):
        """保存する動作はアダプタークラスへ"""

        user = super(MyCustomSignupForm, self).save(request)
        return user


class CreateUserForm(forms.Form):
    num1 = forms.IntegerField(label='引数１', required=True, min_value=0, max_value=100, widget=forms.NumberInput(attrs={'placeholder': 0}))
    num2 = forms.IntegerField(label='引数２', required=True, min_value=0, max_value=100, widget=forms.NumberInput(attrs={'placeholder': 10}))
