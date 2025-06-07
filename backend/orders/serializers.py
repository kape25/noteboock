from rest_framework import serializers
from .models import Order, OrderItem, CartItem
from rest_framework.exceptions import ValidationError
from laptops.models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'stock']  # Добавили stock для проверки наличия


class CartItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='product.name', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    image = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'name', 'price', 'image', 'quantity', 'total_price', 'product']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.product.image and hasattr(obj.product.image, 'url'):
            return request.build_absolute_uri(obj.product.image.url)
        return None

    def get_total_price(self, obj):
        return round(obj.product.price * obj.quantity, 2)


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total = serializers.ReadOnlyField(source='price * quantity')

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price', 'total']


class OrderCreateSerializer(serializers.ModelSerializer):
    items = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=True
    )

    class Meta:
        model = Order
        fields = [
            'user', 'full_name', 'email', 'phone', 'address',
            'delivery_method', 'payment_method', 'items'
        ]
        extra_kwargs = {
            'user': {'required': False}  # Если user устанавливается автоматически
        }

    def create(self, validated_data):
        # Извлекаем items из validated_data
        items_data = validated_data.pop('items', [])

        # Создаём заказ без items
        order = Order.objects.create(**validated_data)

        # Проверяем товары и создаём OrderItem
        total_price = 0
        order_items = []

        for item in items_data:
            product_id = item.get('product_id')
            quantity = item.get('quantity', 1)

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                raise ValidationError(f'Товар с ID {product_id} не найден')

            if product.stock < quantity:
                raise ValidationError(f'Недостаточно товара {product.name} на складе')

            item_price = product.price * quantity
            total_price += item_price

            order_items.append(OrderItem(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price
            ))

        # Создаём все OrderItem разом
        OrderItem.objects.bulk_create(order_items)

        # Обновляем общую сумму заказа
        order.total_price = total_price
        order.save(update_fields=['total_price'])

        # Обновляем остатки товаров
        for item in order_items:
            product = item.product
            product.stock -= item.quantity
            product.save(update_fields=['stock'])

        return order

    def validate(self, data):
        items = data.get('items', [])
        if not items:
            raise serializers.ValidationError('Не указаны товары для заказа')
        return data


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField()
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'




