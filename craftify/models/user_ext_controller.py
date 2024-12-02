from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.base_user import BaseUserManager
from .address_controller import Address

class UserExtendedManager(BaseUserManager):
    
    def create_user(self, email, password=None, **extra_fields):
        
        pass

    def create_superuser(self, email, password=None, **extra_fields):
        
        pass  

class UserExtended(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    address = models.OneToOneField(
        Address,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        help_text="User's address"
    )

    bio = models.TextField(
        null=True,
        blank=True,
        help_text="User Bio"
    )

    country_code = models.CharField(
        max_length=4,
        validators=[RegexValidator(
            regex=r'^\+\d{1,3}$',  # Enforce 1 to 3 digits after '+'
            message="The country code must start with a '+' and be followed by up to 3 digits.",
            code='INVALID_PHONE_NUMBER'
        )],
        null=False,
        blank=False,
        help_text="Country Code for Phone Numbers"
    )

    date_of_birth = models.DateField(
        null=False,
        blank=False,
        help_text="Enter your date of birth."
    )

    drivers_license_number = models.CharField(
        max_length=16,
        validators=[RegexValidator(
            regex=r'^[A-Za-z0-9]{6,16}$',
            message="Driver's license must be 6–16 alphanumeric characters.",
            code='INVALID_ID_NUMBER'
        )],
        help_text="Enter a valid driver's license number (6–16 characters).",
        null=False,
        blank=False
    )

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='userextended_set',  
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )

    phone_number = models.CharField(
        max_length=15,
        validators=[RegexValidator(
            regex=r'^\+?\d{10,15}$',
            message="Enter a valid phone number."
        )],
        null=False,
        blank=False,
        help_text="Enter your phone number."
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='userextended_set',  
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserExtendedManager()

    class Meta:
        verbose_name = "Extended User Model"
        verbose_name_plural = "Extended User Models"