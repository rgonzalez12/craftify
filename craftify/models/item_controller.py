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

User = get_user_model()

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
                message='Name can only contain letters, numbers, spaces, and hyphens.'
            )
        ]
    )
    description = models.TextField(
        help_text="Description of the item"
    )
    category = models.CharField(
        max_length=100,
        help_text="Category of the item"
    )
    image = models.ImageField(
        upload_to='item_images/',
        validators=[validate_image_file_extension],
        null=True,
        blank=True,
        help_text="Image of the item"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
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

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

class PurchaseOrder(models.Model):
    seller = models.ForeignKey(User, related_name='sales', on_delete=models.CASCADE)
    buyer = models.ForeignKey(User, related_name='purchases', on_delete=models.CASCADE)
    items = models.ManyToManyField(Item, through='PurchaseOrderItem')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Order #{self.id} from {self.seller} to {self.buyer}"

class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

class Review(models.Model):
    purchase_order_item = models.ForeignKey(PurchaseOrderItem, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Review by {self.reviewer} on {self.purchase_order_item.item.name}"

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