from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=1000)
    complete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField(default=0)
    updated_at = models.DateTimeField(null=True)
    updated_by = models.IntegerField(default=0)
    deleted_at = models.DateTimeField(null=True)
    deleted_by = models.IntegerField(default=0)

    def __str__(self):
        return self.title
