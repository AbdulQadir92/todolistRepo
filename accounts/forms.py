from django.forms import forms, ModelForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class UserForm(ModelForm):
    class Meta:
        model = User
        fields = '__all__'
