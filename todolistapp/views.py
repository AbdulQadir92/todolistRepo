from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import *
import json


# Create your views here.
def home(request):
    context = {}
    return render(request, 'todolistapp/index.html', context)


def save_todo(request):
    data = json.loads(request.body)

    title = data['title']
    description = data['description']

    task = Task.objects.create(title=title, description=description)
    task.save()
    return HttpResponse('Task saved successfully')


def all_todos(request):
    if request.method == 'GET':
        return JsonResponse({'title': 'Demo Title', 'description': 'Demo Description'})
