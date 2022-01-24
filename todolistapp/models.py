from django.db import models

# Create your models here.
class Task(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    # created_by =
    updated_at = models.DateTimeField(null=True)
    # updated_by =
    deleted_at = models.DateTimeField(null=True)
    # deleted_by =
