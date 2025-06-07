from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Product(models.Model):
    name = models.CharField('Название', max_length=255)
    price = models.DecimalField('Цена', max_digits=10, decimal_places=2)
    image = models.ImageField('Изображение', upload_to='products/', null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    in_stock = models.BooleanField(default=False)

    # Новые поля
    brand = models.CharField('Марка', max_length=100, blank=True, null=True)
    model = models.CharField('Модель', max_length=100, blank=True, null=True)
    screen_size = models.CharField('Размер экрана', max_length=50, blank=True, null=True)
    processor = models.CharField('Процессор', max_length=100, blank=True, null=True)
    cores = models.PositiveIntegerField('Количество ядер', blank=True, null=True)
    ram = models.PositiveIntegerField('Объём памяти (ГБ)', blank=True, null=True)
    storage = models.PositiveIntegerField('Ёмкость накопителя (ГБ)', blank=True, null=True)

    def __str__(self):
        return self.name
