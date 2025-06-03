# admin.py
from django.contrib import admin
from .models import Laptop

@admin.register(Laptop)
class LaptopAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'price', 'in_stock')
    search_fields = ('name', 'brand')
    list_filter = ('brand', 'in_stock')
    ordering = ('-price',)
