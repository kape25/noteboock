from django.db import models
from django.conf import settings
from laptops.models import Laptop

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    laptops = models.ManyToManyField(Laptop, through='OrderItem')
    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    laptop = models.ForeignKey(Laptop, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
