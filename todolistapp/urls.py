from django.urls import path
from . import views


urlpatterns = [

    path('', views.home, name='home'),
    path('all_todos/', views.all_todos, name='all_todos'),
    path('save_todo/', views.save_todo, name='save_todo'),
    path('update_todo/', views.update_todo, name='update_todo'),
    path('delete_todo/<int:task_id>/', views.delete_todo, name='delete_todo'),
]
