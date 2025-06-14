from django.urls import path
from .views import MyTokenObtainPairView, RegisterView, ProfileView, UpdateProfileView, ContactView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserListView

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('contact/', ContactView.as_view()),


    # Получение профиля — GET
    path('profile/me/', ProfileView.as_view(), name='profile'),

    # Обновление профиля — PUT/PATCH
    path('profile/update/', UpdateProfileView.as_view(), name='update_profile'),  # Можно переименовать
]