from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.base_user import BaseUserManager
from .address_controller import Address
from django.utils import timezone

class UserExtendedManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('date_of_birth', '1970-01-01')
        extra_fields.setdefault('country_code', '+1')
        extra_fields.setdefault('drivers_license_number', 'DEFAULT123456')
        extra_fields.setdefault('phone_number', '+1234567890')

        # Create a unique address using timestamp
        timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
        default_address = Address.objects.create(
            street=f'Default Street {timestamp}',
            city='Default City',
            state='Default State',
            postal_code='00000',
            country='Default Country'
        )
        extra_fields['address'] = default_address

        return self.create_user(email, password, **extra_fields)

class UserExtended(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    address = models.OneToOneField(
        Address,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    bio = models.TextField(null=True, blank=True)
    country_code = models.CharField(max_length=4, blank=True)
    drivers_license_number = models.CharField(max_length=20, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    website = models.URLField(blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    objects = UserExtendedManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email