from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LaptopViewSet

router = DefaultRouter()
router.register(r'laptops', LaptopViewSet)

urlpatterns = [
    path('', include(router.urls)),
]