
from django.contrib import admin
from .models import Product

@admin.register(Product)
class LaptopAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'price', 'in_stock','image')
    search_fields = ('name', 'description')
    list_filter = ('name', 'price')
    ordering = ('-price',)
