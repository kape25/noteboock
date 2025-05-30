from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone  # ✅ Правильный импорт

class CustomUserManager(BaseUserManager):
    def create_user(self, nickname, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email")
        email = self.normalize_email(email)
        user = self.model(nickname=nickname, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, nickname, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(nickname, email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    nickname = models.CharField(unique=True, max_length=100)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)  # ✅ Теперь работает
    last_login = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'nickname'
    REQUIRED_FIELDS = ['email']

    objects = CustomUserManager()

    def __str__(self):
        return self.nickname