from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer, ContactSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import UpdateAPIView
from rest_framework import status
from django.core.mail import send_mail

User = get_user_model()

class UserListView(ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UpdateProfileView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class ContactView(APIView):
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        message = request.data.get('message')

        if not name or not email or not message:
            return Response({"error": "Все поля обязательны"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            send_mail(
                subject=f"Новое сообщение от {name}",
                message=message,
                from_email=email,  # Отправитель — тот, кто заполнил форму
                recipient_list=['and.pasha25@gmail.com'],  # Куда приходит письмо
                fail_silently=False
            )
            return Response({"success": "Сообщение успешно отправлено!"}, status=status.HTTP_200_OK)
        except Exception as e:
            print("Ошибка отправки:", str(e))
            return Response({"error": f"Ошибка отправки: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def send_welcome_email(user):
    send_mail("Добро пожаловать!", "Спасибо за регистрацию", "from@example.com", [user.email])