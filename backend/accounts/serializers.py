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
        # Добавляем все необходимые данные о пользователе
        token['nickname'] = user.nickname
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['email'] = user.email
        return token

    def validate(self, attrs):
        credentials = {
            'username': attrs.get('nickname'),
            'password': attrs.get('password')
        }

        if credentials['username'] and credentials['password']:
            user = authenticate(**credentials)

            if user:
                if not user.is_active:
                    raise ValidationError({'detail': _('Аккаунт неактивен')})

                data = {}
                refresh = self.get_token(user)

                data['refresh'] = str(refresh)
                data['access'] = str(refresh.access_token)

                # Добавляем информацию о пользователе в ответ
                data['user'] = {
                    'nickname': user.nickname,
                    'email': user.email,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser
                }
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
        fields = ['id', 'nickname', 'email', 'first_name', 'last_name', 'avatar', 'is_staff', 'is_superuser']
        extra_kwargs = {
            'avatar': {'required': False},
            'is_staff': {'read_only': True},
            'is_superuser': {'read_only': True}
        }


class ContactSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    message = serializers.CharField()



