from rest_framework import viewsets
from .models import Laptop
from .serializers import LaptopSerializer

class LaptopViewSet(viewsets.ModelViewSet):
    queryset = Laptop.objects.all()
    serializer_class = LaptopSerializer
