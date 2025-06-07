
from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'brand', 'model', 'price', 'stock', 'in_stock',
        'screen_size', 'processor', 'cores', 'ram', 'storage'
    )
    search_fields = ('name', 'brand', 'model', 'processor')
    list_filter = ('in_stock', 'brand', 'processor', 'ram', 'storage')
    ordering = ('-id',)
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'price', 'image')
        }),
        ('Характеристики', {
            'fields': ('brand', 'model', 'screen_size', 'processor', 'cores', 'ram', 'storage')
        }),
        ('Доступность', {
            'fields': ('stock', 'in_stock')
        }),
    )
