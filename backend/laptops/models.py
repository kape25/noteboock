from django.db import models

class Product(models.Model):
    name = models.CharField('Название', max_length=255)
    description = models.TextField('Описание')
    price = models.DecimalField('Цена', max_digits=10, decimal_places=2)  # Исправлено здесь
    image = models.ImageField('Изображение', upload_to='products/', null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    in_stock = models.BooleanField(default=False)

    def __str__(self):
        return self.name