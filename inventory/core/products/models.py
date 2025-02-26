from django.db import models
import barcode
from barcode.writer import ImageWriter
from io import BytesIO
from django.core.files import File

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=250)
    barcode = models.ImageField(upload_to="images/", blank=True, null=True)
    country_code = models.CharField(max_length=3, default="254")
    manufacturer_code = models.CharField(max_length=4, default="3452")
    product_code = models.CharField(max_length=5)
    price = models.IntegerField()
    
    def __str__(self):
        return str(self.name)
    
    def save(self, *args, **kwargs):
        EAN = barcode.get_barcode_class("ean13")
        ean = EAN(f"{self.country_code}{self.manufacturer_code}{self.product_code}", writer=ImageWriter())
        buffer = BytesIO()
        ean.write(buffer)
        self.barcode.save(f"{self.country_code}{self.manufacturer_code}{self.product_code}.png", File(buffer), save=False)
        
        return super().save(*args, **kwargs)
        