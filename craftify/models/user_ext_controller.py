from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator, MaxValueValidator, MinValueValidator
from address.fields import AddressField

class UserExtended(AbstractUser):
    
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

    address = AddressField(on_delete=models.CASCADE, null=True, blank=True)

    phone_number = models.CharField(
        max_length=15,
        validators=[RegexValidator(regex=r'^\+?\d{10,15}$', message="Enter a valid phone number.")],
        null=False,
        blank=False
    )

    country_code = models.CharField(
        max_length=4,
        validators=[RegexValidator(
            regex=r'^\+\d{1,3}$',  # Enforce 1 to 3 digits after '+'
            message="The country code must start with a '+' and be followed by up to 3 digits.",
            code='INVALID_PHONE_NUMBER'
        )],
        null=False,
        blank=False
    )

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='userextended_set',  # Avoid reverse accessor conflict
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='userextended_set',  # Avoid reverse accessor conflict
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    class Meta:
        verbose_name = "Extended User Model"
        verbose_name_plural = "Extended User Models"

# supertestuser is the test-build admin user

