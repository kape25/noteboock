from django.urls import path
from .views import AddToCartView, CartDetailView, RemoveFromCartView

urlpatterns = [
    path('cart/add/', AddToCartView.as_view(), name='add_to_cart'),
    path('cart/', CartDetailView.as_view(), name='cart_detail'),
    path('cart/remove/', RemoveFromCartView.as_view(), name='remove_from_cart'),
]