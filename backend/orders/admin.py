from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ('product', 'quantity', 'price')
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'full_name', 'email', 'phone',
        'delivery_method', 'payment_method', 'total_price', 'created_at'
    )
    list_filter = ('delivery_method', 'payment_method', 'created_at')
    search_fields = ('full_name', 'email', 'phone')
    inlines = [OrderItemInline]
    readonly_fields = ('created_at', 'total_price')
    fieldsets = (
        ('Пользователь', {
            'fields': ('user',)
        }),
        ('Контактная информация', {
            'fields': ('full_name', 'email', 'phone')
        }),
        ('Доставка и оплата', {
            'fields': ('delivery_method', 'payment_method', 'address')
        }),
        ('Дополнительно', {
            'fields': ('total_price', 'created_at')
        }),
    )

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
    list_filter = ('order',)
    readonly_fields = ('order', 'product', 'quantity', 'price')
