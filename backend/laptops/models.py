from django.db import models

class Laptop(models.Model):
    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    specs = models.TextField()
    image = models.ImageField(upload_to='laptops/')
    in_stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name