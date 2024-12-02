from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.validators import MaxValueValidator, MinValueValidator
from django.core.exceptions import ValidationError

class Review(models.Model):
   
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews_made',
        help_text="User who wrote the review"
    )
   
    reviewee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews_received',
        help_text="User who is being reviewed"
    )
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        help_text="Content type of the object being reviewed"
    )
    object_id = models.PositiveIntegerField(
        help_text="ID of the object being reviewed"
    )
    content_object = GenericForeignKey('content_type', 'object_id')

    RATING_CHOICES = [
        (1, '1 - Poor'),
        (2, '2 - Fair'),
        (3, '3 - Good'),
        (4, '4 - Very Good'),
        (5, '5 - Excellent'),
    ]
    rating = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1, message="Rating must be at least 1."),
            MaxValueValidator(5, message="Rating cannot be more than 5.")
        ],
        choices=RATING_CHOICES,
        help_text="Rating from 1 (worst) to 5 (best)"
    )
    comment = models.TextField(
        max_length=1000,
        help_text="Review text (up to 1000 characters)"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the review was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the review was last updated"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Review"
        verbose_name_plural = "Reviews"
        unique_together = ('user', 'content_type', 'object_id')
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['user']),
            models.Index(fields=['reviewee']),
        ]

    def __str__(self):
        return f'Review #{self.pk} by {self.user.username} for {self.reviewee.username} on {self.content_object}'

    def clean(self):
        super().clean()
        if self.user == self.reviewee:
            raise ValidationError("You cannot review yourself.")
        if not self.content_object:
            raise ValidationError("The content object does not exist.")
        if hasattr(self.content_object, 'owner'):
            if self.reviewee != self.content_object.owner:
                raise ValidationError("The reviewee must be the owner of the content object.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)