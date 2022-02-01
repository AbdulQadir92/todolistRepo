# Generated by Django 3.2.11 on 2022-01-30 12:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todolistapp', '0009_task_task_datetime'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='task_datetime',
        ),
        migrations.AddField(
            model_name='task',
            name='task_date',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='task',
            name='task_time',
            field=models.TimeField(null=True),
        ),
    ]
