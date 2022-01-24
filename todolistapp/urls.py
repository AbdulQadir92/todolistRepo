from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('all_todos/', views.all_todos, name='all_todos'),
    path('save_todo/', views.save_todo, name='save_todo')
]
