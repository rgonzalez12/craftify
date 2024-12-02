from django.db import models
from django.conf import settings
from django.core.validators import (
    MinValueValidator,
    MaxValueValidator,
    RegexValidator,
    validate_image_file_extension
)
from django.contrib.contenttypes.fields import GenericRelation
from django.utils import timezone
from django.core.exceptions import ValidationError

class Item(models.Model):
   
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='items',
        help_text="Owner of the item"
    )

    name = models.CharField(
        max_length=255,
        validators=[
            RegexValidator(
                regex=r'^[\w\s\-]+$',
                message='Name can only contain letters, numbers, spaces, and hyphens.',
                code='invalid_name'
            )
        ],
        help_text="Name of the item"
    )

    description = models.TextField(
        max_length=2000,
        help_text="Description of the item (up to 2000 characters)"
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(0.01, message="Price must be at least $0.01."),
            MaxValueValidator(1000000, message="Price cannot exceed $1,000,000.")
        ],
        help_text="Price of the item (between $0.01 and $1,000,000)"
    )

    quantity = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1, message="Quantity must be at least 1."),
            MaxValueValidator(10000, message="Quantity cannot exceed 10,000.")
        ],
        help_text="Available quantity (between 1 and 10,000)"
    )

    image = models.ImageField(
        upload_to='item_images/',
        validators=[validate_image_file_extension],
        null=True,
        blank=True,
        help_text="Upload an image of the item (optional)"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the item was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the item was last updated"
    )

    reviews = GenericRelation(
        'Review',
        related_query_name='item',
        content_type_field='content_type',
        object_id_field='object_id'
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Item"
        verbose_name_plural = "Items"
        indexes = [
            models.Index(fields=['owner']),
            models.Index(fields=['name']),
        ]
        unique_together = ('owner', 'name')

    def __str__(self):
        return f'{self.name} by {self.owner.username}'

    def clean(self):
        super().clean()
        if self.price > 1000000:
            raise ValidationError("Price cannot exceed $1,000,000.")
      
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)