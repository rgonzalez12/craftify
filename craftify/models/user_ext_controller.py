from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.base_user import BaseUserManager
from .address_controller import Address
from django.core.exceptions import ObjectDoesNotExist

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

        try:
            default_address = Address.objects.get(id=1)
        except ObjectDoesNotExist:
            default_address = Address.objects.create(
                street='Default Street',
                city='Default City',
                state='Default State',
                postal_code='00000',
                country='Default Country'
            )
        extra_fields.setdefault('address', default_address)

        if not extra_fields.get('is_staff'):
            raise ValueError('Superuser must have is_staff=True.')
        if not extra_fields.get('is_superuser'):
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class UserExtended(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    address = models.OneToOneField(
        Address,
        on_delete=models.CASCADE,
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
            regex=r'^\+\d{1,3}$',
            message="The country code must start with a '+' and be followed by up to 3 digits.",
            code='INVALID_PHONE_NUMBER'
        )],
        help_text="Country Code for Phone Numbers"
    )
    date_of_birth = models.DateField(
        help_text="Enter your date of birth."
    )
    drivers_license_number = models.CharField(
        max_length=16,
        validators=[RegexValidator(
            regex=r'^[A-Za-z0-9]{6,16}$',
            message="Driver's license must be 6–16 alphanumeric characters.",
            code='INVALID_ID_NUMBER'
        )],
        help_text="Enter a valid driver's license number (6–16 characters)."
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
        help_text="Enter your phone number."
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='userextended_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    website = models.URLField(blank=True)
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