from django.urls import path
from .views import AddToCartView, CartDetailView, RemoveFromCartView, OrderCreateView, UpdateCartItemView, \
    AdminOrderListView, dashboard_data, update_order_status, delete_user, MyOrdersView, OrderDeleteView

urlpatterns = [
    path('cart/add/', AddToCartView.as_view(), name='add_to_cart'),
    path('cart/', CartDetailView.as_view(), name='cart_detail'),
    path('orders/create/', OrderCreateView.as_view(), name='create_order'),
    path('cart/remove/', RemoveFromCartView.as_view(), name='remove_from_cart'),
    path('cart/update/', UpdateCartItemView.as_view(), name='update_cart_item'),
    path('orders/', AdminOrderListView.as_view(), name='admin_order_list'),
    path('dashboard/', dashboard_data),
    path('orders/<int:order_id>/', update_order_status),
    path('users/<int:user_id>/', delete_user),
    path('orders/my/', MyOrdersView.as_view(), name='my-orders'),
    path('orders/<int:pk>/delete/', OrderDeleteView.as_view(), name='order-delete'),
]