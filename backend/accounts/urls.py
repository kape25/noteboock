from django.urls import path

from .views import  LoginView, ProfileView, RegisterView

urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view()),
    path('api/profile/', ProfileView.as_view()),
]
