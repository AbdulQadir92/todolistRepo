from django.db import models


# Create your models here.

# class User(models.Model):
#     first_name = models.CharField(max_length=100)
#     last_name = models.CharField(max_length=100)
#     email = models.CharField(max_length=100)
#     username = models.CharField(max_length=100)
#     password = models.CharField(max_length=100)
#     active = models.BooleanField(default=True)
#
#     def __str__(self):
#         return self.first_name


class Task(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=1000)
    complete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    # created_by =
    updated_at = models.DateTimeField(null=True)
    # updated_by =
    deleted_at = models.DateTimeField(null=True)
    # deleted_by =

    def __str__(self):
        return self.title
