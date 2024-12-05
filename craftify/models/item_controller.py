from django.db import models
from django.conf import settings
from django.core.validators import (
    MinValueValidator,
    MaxValueValidator,
    RegexValidator,
    validate_image_file_extension
)
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

User = get_user_model()

class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.01,
        validators=[
            MinValueValidator(0.01)
        ]
    )
    quantity = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1)
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items_for_sale')

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Item"
        verbose_name_plural = "Items"
        indexes = [
            models.Index(fields=['seller']),
            models.Index(fields=['name']),
        ]
        unique_together = ('seller', 'name')

    def __str__(self):
        return f'{self.name} by {self.seller.username}'

class PurchaseOrder(models.Model):
    seller = models.ForeignKey(User, related_name='sales', on_delete=models.CASCADE)
    buyer = models.ForeignKey(User, related_name='purchases', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Order #{self.id} from {self.seller} to {self.buyer}"

class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.01)

    def __str__(self):
        return f"{self.quantity} x {self.item.name}" 

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
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    rating = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Review by {self.user} on {self.content_object}"

class ReturnOrder(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, related_name='returns', on_delete=models.CASCADE)
    item = models.ForeignKey(Item, related_name='returns', on_delete=models.CASCADE)
    seller = models.ForeignKey(User, related_name='return_sales', on_delete=models.CASCADE)
    buyer = models.ForeignKey(User, related_name='return_purchases', on_delete=models.CASCADE)
    refund_given = models.BooleanField(default=False)
    return_date = models.DateTimeField(auto_now_add=True)
    refund_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Return Order #{self.id} for {self.item.name}"
    
    def process_refund(self):
        self.refund_given = True
        self.refund_date = timezone.now()
        self.save()
        self.check_and_update_review()
    
    def check_and_update_review(self):
        time_difference = timezone.now() - self.purchase_order.created_at
        if time_difference <= timedelta(days=45):
            review = Review.objects.filter(purchase_order_item__item=self.item, reviewer=self.buyer).first()
            if review:
                # Edit or delete the review as needed
                review.delete()