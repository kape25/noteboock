from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'nickname', 'first_name', 'last_name', 'email', 'avatar']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['nickname', 'email', 'first_name', 'last_name', 'password']  # ← Убрали avatar

    def create(self, validated_data):
        password = validated_data.pop('password')
        return CustomUser.objects.create_user(password=password, **validated_data)

class LoginSerializer(serializers.Serializer):
    nickname = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
