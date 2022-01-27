from django.contrib.auth.models import User
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import *
import json
import datetime


# Create your views here.
def register(request):
    # user = User.objects.create_user()
    # print('user created')
    return render(request, 'todolistapp/register.html')


def home(request):
    context = {}
    return render(request, 'todolistapp/index.html', context)


def save_todo(request):
    data = json.loads(request.body)
    title = data['title']
    description = data['description']
    # created_by =
    Task.objects.create(title=title, description=description)
    # task = Task(title=title, description=description)
    # task.save()
    print('Task saved successfully')
    return HttpResponse('Task saved successfully')


def all_todos(request):
    tasks = Task.objects.filter(deleted_at=None, updated_at=None)
    # tasks = Task.objects.all()
    tasks_list = []
    for task in tasks:
        task_dict = {
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'complete': task.complete
        }
        tasks_list.append(task_dict)
    return JsonResponse(tasks_list, safe=False)


def update_todo(request):
    data = json.loads(request.body)

    task_id = data['id']
    task = Task.objects.get(id=task_id)
    task.updated_at = datetime.datetime.now()
    # task.updated_by =
    task.save()

    Task.objects.create(title=data['title'], description=data['description'], complete=data['complete'])
    print('Task updated successfully')
    return HttpResponse('Task updated successfully')


def delete_todo(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        task.deleted_at = datetime.datetime.now()
        # task.deleted_by =
        task.save()
    except:
        print('No task with this id exists')

    tasks_count = Task.objects.filter(updated_at=None, deleted_at=None).count()
    print('Task deleted successfully')
    return JsonResponse({'successResponse': 'Task deleted successfully', 'tasks_count': tasks_count})
