from django.db import models
from django.contrib.auth import get_user_model
from laptops.models import Product

User = get_user_model()


class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


class Order(models.Model):
    DELIVERY_METHODS = (
        ('courier', 'Курьером'),
        ('pickup', 'Самовывоз'),
        ('post', 'Почта'),
    )

    PAYMENT_METHODS = (
        ('card', 'Картой'),
        ('cash', 'Наличными'),
        ('bank', 'Банковский перевод'),
    )

    STATUS_CHOICES = (
        ('pending', 'В ожидании'),
        ('confirmed', 'Подтвержден'),
        ('processing', 'Обрабатывается'),
        ('shipped', 'Отправлен'),
        ('delivered', 'Доставлен'),
        ('cancelled', 'Отменён'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    full_name = models.CharField('Имя', max_length=255)
    email = models.EmailField('Email')
    phone = models.CharField('Телефон', max_length=20)
    address = models.TextField('Адрес', blank=True, null=True)
    delivery_method = models.CharField('Способ доставки', max_length=20, choices=DELIVERY_METHODS)
    payment_method = models.CharField('Способ оплаты', max_length=20, choices=PAYMENT_METHODS)
    total_price = models.DecimalField('Сумма', max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='pending')


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'  # добавляем related_name
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"