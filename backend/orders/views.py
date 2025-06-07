from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions, serializers
from rest_framework.permissions import IsAuthenticated
from .models import OrderItem, CartItem  # Добавили CartItem
from .serializers import OrderCreateSerializer, CartItemSerializer, OrderSerializer
from laptops.models import Product
from django.contrib.auth import get_user_model

User = get_user_model()

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Продукт не найден'}, status=status.HTTP_404_NOT_FOUND)

        if product.stock < quantity:
            return Response({'error': 'Недостаточно товара на складе'}, status=status.HTTP_400_BAD_REQUEST)

        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response({'message': 'Товар добавлен в корзину'}, status=status.HTTP_201_CREATED)

class CartDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart_items = CartItem.objects.select_related('product').filter(user=request.user)
        serializer = CartItemSerializer(cart_items, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_item_id = request.data.get('cart_item_id')

        try:
            cart_item = CartItem.objects.get(id=cart_item_id, user=request.user)
            cart_item.delete()
            return Response({"message": "Товар удалён из корзины"}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({"error": "Товар не найден"}, status=status.HTTP_404_NOT_FOUND)


class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        return OrderCreateSerializer

    def perform_create(self, serializer):
        user = self.request.user
        data = self.request.data

        # Получаем список товаров из запроса
        items_data = data.get('items', [])

        if not items_data:
            raise serializers.ValidationError('Не указаны товары для заказа')

        # Рассчитываем общую сумму и проверяем наличие
        total_price = 0
        order_items = []

        for item in items_data:
            product_id = item.get('product_id')
            quantity = item.get('quantity', 1)

            product = get_object_or_404(Product, id=product_id)

            if product.stock < quantity:
                raise serializers.ValidationError(f'Недостаточно товара {product.name} на складе')

            price = product.price
            total_price += price * quantity

            order_items.append({
                'product': product,
                'quantity': quantity,
                'price': price
            })

        # Создаем заказ
        order = serializer.save(
            user=user,
            total_price=total_price
        )

        # Создаем записи о товарах в заказе
        for item in order_items:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                quantity=item['quantity'],
                price=item['price']
            )

        # Обновляем остатки на складе
        for item in order_items:
            product = item['product']
            product.stock -= item['quantity']
            product.save()

        return order

class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_item_id = request.data.get('cart_item_id')
        new_quantity = request.data.get('quantity')

        if not isinstance(new_quantity, int) or new_quantity < 1:
            return Response({'error': 'Количество должно быть положительным целым числом'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = CartItem.objects.get(id=cart_item_id, user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Товар не найден в корзине'}, status=status.HTTP_404_NOT_FOUND)

        if cart_item.product.stock < new_quantity:
            return Response({'error': 'Недостаточно товара на складе'}, status=status.HTTP_400_BAD_REQUEST)

        cart_item.quantity = new_quantity
        cart_item.save()

        return Response({'message': 'Количество обновлено', 'quantity': cart_item.quantity}, status=status.HTTP_200_OK)


