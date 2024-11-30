from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator, MaxValueValidator, MinValueValidator

class UserExtended(AbstractUser):
    phone_number = models.BigIntegerField(
        validators=[
            MinValueValidator(10**14),
            MaxValueValidator(10**15 - 1)
        ]
    )
    country_code = models.CharField(
        max_length=4,
        validators=[
            RegexValidator(
                regex=r'^\+\d{0,3}$',
                message="The Country Code must start with a '+' and be followed by up to 3 digits.",
                code='INVALID_PHONE_NUMBER'
            )
        ]
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
        verbose_name = "Extended User"
        verbose_name_plural = "Extended Users"      


