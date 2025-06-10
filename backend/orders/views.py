from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework import status, generics, permissions, serializers
from rest_framework.permissions import IsAuthenticated
from .models import OrderItem, CartItem  # Добавили CartItem
from .serializers import OrderCreateSerializer, CartItemSerializer, OrderSerializer
from laptops.models import Product
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Order
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from datetime import timedelta
from django.utils.timezone import now
from .models import User, Order
from accounts.serializers import UserSerializer
from django.core.paginator import Paginator
from django.db.models import Q


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



class AdminOrderListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff and not request.user.is_superuser:
            return Response({'detail': 'Доступ запрещён'}, status=403)

        orders = Order.objects.select_related('user').prefetch_related(
            'items__product'
        ).all()

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)



@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Заказ не найден'}, status=404)

    status = request.data.get('status')
    if status not in dict(Order.STATUS_CHOICES).keys():
        return Response({'error': 'Неверный статус'}, status=400)

    order.status = status
    order.save()

    return Response({'message': 'Статус обновлён', 'status': order.status})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'Пользователь не найден'}, status=404)

    user.delete()
    return Response({'message': 'Пользователь успешно удален'})


@api_view(['GET'])
def dashboard_data(request):
    period = request.query_params.get('period', 'all')
    search_user = request.query_params.get('search_user', '')
    search_order = request.query_params.get('search_order', '')
    user_page = int(request.query_params.get('user_page', 1))
    order_page = int(request.query_params.get('order_page', 1))
    today = now().date()

    # Фильтрация по времени
    if period == 'day':
        orders = Order.objects.filter(created_at__date=today)
    elif period == 'week':
        start_week = today - timedelta(days=today.weekday())
        orders = Order.objects.filter(created_at__date__gte=start_week)
    elif period == 'month':
        orders = Order.objects.filter(created_at__year=today.year, created_at__month=today.month)
    else:
        orders = Order.objects.all()

    # Поиск по заказам
    if search_order:
        orders = orders.filter(
            Q(id__icontains=search_order) |
            Q(full_name__icontains=search_order)
        )

    # Поиск по пользователям
    users = User.objects.all()
    if search_user:
        users = users.filter(
            Q(nickname__icontains=search_user) |
            Q(email__icontains=search_user)
        )

    # Пагинация пользователей
    user_paginator = Paginator(users, 2)
    user_page_obj = user_paginator.get_page(user_page)

    # Пагинация заказов
    order_paginator = Paginator(orders, 4)
    order_page_obj = order_paginator.get_page(order_page)

    total_orders = orders.count()
    total_cost = sum(order.total_price for order in orders)
    avg_check = round(total_cost / total_orders, 2) if total_orders else 0

    return Response({
        'users': UserSerializer(user_page_obj, many=True).data,
        'orders': OrderSerializer(order_page_obj, many=True).data,
        'total_cost': total_cost,
        'total_orders': total_orders,
        'avg_check': avg_check,
        'user_pagination': {
            'count': user_paginator.count,
            'num_pages': user_paginator.num_pages,
            'current_page': user_page_obj.number,
        },
        'order_pagination': {
            'count': order_paginator.count,
            'num_pages': order_paginator.num_pages,
            'current_page': order_page_obj.number,
        }
    })