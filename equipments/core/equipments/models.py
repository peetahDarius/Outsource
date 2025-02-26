from django.db import models

# Create your models here.


class Equipment(models.Model):
    name = models.TextField()
    description = models.TextField()
    rate_per_hour = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)