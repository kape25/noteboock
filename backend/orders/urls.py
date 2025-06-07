from django.urls import path
from .views import AddToCartView, CartDetailView, RemoveFromCartView, OrderCreateView, UpdateCartItemView

urlpatterns = [
    path('cart/add/', AddToCartView.as_view(), name='add_to_cart'),
    path('cart/', CartDetailView.as_view(), name='cart_detail'),
    path('orders/create/', OrderCreateView.as_view(), name='create_order'),
    path('cart/remove/', RemoveFromCartView.as_view(), name='remove_from_cart'),
    path('cart/update/', UpdateCartItemView.as_view(), name='update_cart_item'),
]