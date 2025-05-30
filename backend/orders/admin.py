from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'created_at', 'get_total_items']
    inlines = [OrderItemInline]

    def get_total_items(self, obj):
        return sum([item.quantity for item in obj.orderitem_set.all()])
    get_total_items.short_description = 'Total Items'

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'laptop', 'quantity']
