from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from accounts.decorators import *
from .models import *
import json
import datetime
from django.utils.dateparse import parse_datetime


# Create your views here.

@unauthenticated_user
def home(request, *args, **kwargs):
    context = {}
    return render(request, 'todolistapp/index.html', context)


def save_todo(request):
    data = json.loads(request.body)
    user = request.user
    title = data['title']
    description = data['description']
    task_date = data['task_date']
    task_time = data['task_time']

    # print(task_date)
    # print(task_time)

    created_by = request.user.id
    Task.objects.create(
        user=user,
        title=title,
        description=description,
        task_date=task_date,
        task_time=task_time,
        created_by=created_by
    )
    # task = Task(title=title, description=description)
    # task.save()
    print('Task saved successfully')
    return HttpResponse('Task saved successfully')



def all_todos(request):
    print(request.user)
    user = request.user
    tasks = Task.objects.filter(deleted_at=None, updated_at=None, user=user)
    # tasks = Task.objects.all()
    tasks_list = []
    for task in tasks:
        task_dict = {
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'task_date': task.task_date,
            'task_time': task.task_time,
            'complete': task.complete
        }
        tasks_list.append(task_dict)
    return JsonResponse(tasks_list, safe=False)


def update_todo(request):
    data = json.loads(request.body)

    user = request.user

    task_id = data['id']
    task = Task.objects.get(id=task_id)
    task.updated_at = datetime.datetime.now()
    task.updated_by = user.id
    task.save()

    Task.objects.create(
        user=user,
        title=data['title'],
        description=data['description'],
        task_date=data['task_date'],
        task_time=data['task_time'],
        complete=data['complete']
    )
    print('Task updated successfully')
    return HttpResponse('Task updated successfully')


def delete_todo(request, task_id):
    user = request.user
    try:
        task = Task.objects.get(id=task_id)
        task.deleted_at = datetime.datetime.now()
        task.deleted_by = user.id
        task.save()

    except:
        print('No task with this id exists')

    tasks_count = Task.objects.filter(user=user, updated_at=None, deleted_at=None).count()
    print('Task deleted successfully')
    return JsonResponse({'successResponse': 'Task deleted successfully', 'tasks_count': tasks_count})


# def delete_todo(request, task_id):
#     user = request.user
#     if user.is_superuser:
#         try:
#             task = Task.objects.get(id=task_id)
#             task.deleted_at = datetime.datetime.now()
#             task.deleted_by = user.id
#             task.save()
#
#             tasks_count = Task.objects.filter(user=user, updated_at=None, deleted_at=None).count()
#             print('Task deleted successfully')
#             return JsonResponse({'successResponse': 'Task deleted successfully', 'tasks_count': tasks_count})
#         except:
#             print('No task with this id exists')
#     else:
#         return JsonResponse({'msg': 'You are not authorized to delete task'})






