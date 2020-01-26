from allauth.account.forms import SignupForm
from django import forms
from .models import CustomUser

class MyCustomSignupForm(SignupForm):
    username = forms.CharField(label='ID', required=True, widget=forms.TextInput(attrs={'placeholder':'taro1225'}))
    usernonamae = forms.CharField(label='ユーザ名', required=True, widget=forms.TextInput(attrs={'placeholder':'太郎'}))
    email = forms.EmailField(label='メールアドレス', required=True, widget=forms.TextInput(attrs={'placeholder':'taro@example.com'}))
    sex = forms.ChoiceField(label='性別', required=True, choices=CustomUser.choice_site)
    age = forms.IntegerField(label='年齢', required=True, min_value=0, max_value=150)
    born_at = forms.DateField(label='生年月日', required=False, widget=forms.SelectDateWidget(years=range(1900,2021)))

    def save(self, request):

        # Ensure you call the parent class's save.
        # .save() returns a User object.
        user = super(MyCustomSignupForm, self).save(request)

        # Add your own processing here.

        # You must return the original result.
        return user