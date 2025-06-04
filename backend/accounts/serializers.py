from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['nickname'] = user.nickname
        return token

    def validate(self, attrs):
        # Переопределяем метод validate, чтобы использовать nickname вместо username
        credentials = {
            'username': attrs.get('nickname'),  # Используем nickname как username
            'password': attrs.get('password')
        }

        if credentials['username'] and credentials['password']:
            user = authenticate(**credentials)

            if user:
                data = {}
                refresh = self.get_token(user)

                data['refresh'] = str(refresh)
                data['access'] = str(refresh.access_token)
                return data
            else:
                raise ValidationError({'detail': _('Неверные учетные данные')})
        else:
            raise ValidationError({'detail': _('Необходимы nickname и пароль')})


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['nickname', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nickname', 'email', 'first_name', 'last_name', 'avatar']
        extra_kwargs = {'avatar': {'required': False}}

