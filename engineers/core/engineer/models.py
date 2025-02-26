from django.db import models

# Create your models here.

class Engineer(models.Model):
    first_name = models.CharField(200, max_length=50)
    last_name = models.CharField(200, max_length=50)
    email = models.EmailField(max_length=254, unique=True)
    phone = models.CharField(max_length=50)
    location = models.CharField(max_length=250)
    bio = models.TextField()
    image = models.ImageField(upload_to="engineers/", null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return str(self.email)