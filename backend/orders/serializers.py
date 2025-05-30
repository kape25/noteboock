from rest_framework import serializers
from .models import Order, OrderItem, Laptop
from laptops.serializers import LaptopSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    laptop = LaptopSerializer()

    class Meta:
        model = OrderItem
        fields = ['laptop', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(source='orderitem_set', many=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'items']

