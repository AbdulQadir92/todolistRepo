from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import auth
from .forms import *
from .decorators import *
import json


# Create your views here.
def user_register(request):
    if request.method == 'POST':
        print(request.path)
        data = json.loads(request.body)

        username = data['username']
        email = data['email']
        password1 = data['password1']
        password2 = data['password2']
        first_name = data['first_name']
        last_name = data['last_name']

        if password1 == password2:
            if User.objects.filter(username=username).exists():
                print('Username already taken')
                return HttpResponse('Username already taken')
            else:
                user = User.objects.create_user(username=username, password=password1, email=email)
                user.first_name = first_name
                user.last_name = last_name
                user.save()
                print('User created')

                user = auth.authenticate(username=username, password=password1)
                if user is not None:
                    print(user.username)
                    auth.login(request, user)
                else:
                    print('user not created or logged in')

                return HttpResponse('User created')
        else:
            print('Passwords do not match')
        return HttpResponse('Passwords do not match')

    else:
        print(request.path)
        return render(request, 'accounts/register.html')


def user_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data['username']
        password = data['password']

        # username = request.POST.get('username')
        # password = request.POST.get('password')

        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            print(f'{user.first_name} logged in')
            return HttpResponse(f'{user.first_name} logged in')
        else:
            # messages.info(request, 'Invalid username or password')
            print('Invalid username or password')
            return HttpResponse('Invalid username or password')
    else:
        return render(request, 'accounts/login.html')


def user_logout(request):
    auth.logout(request)
    return redirect('login')
