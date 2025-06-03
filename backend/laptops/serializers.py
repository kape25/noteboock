# serializers.py
from rest_framework import serializers
from .models import Laptop

class LaptopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Laptop
        fields = ['id', 'name', 'brand', 'price', 'specs', 'image', 'in_stock']