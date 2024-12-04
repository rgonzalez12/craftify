from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth import get_user_model
from .item_controller import Item, PurchaseOrder, PurchaseOrderItem

User = get_user_model()

class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart',
        help_text="User who owns the cart"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart of {self.user.username}"

    def add_item(self, item, quantity=1):
        cart_item, created = CartItem.objects.get_or_create(cart=self, item=item)
        if not created:
            cart_item.quantity += quantity
        cart_item.save()

    def remove_item(self, item):
        cart_item = CartItem.objects.filter(cart=self, item=item).first()
        if cart_item:
            cart_item.delete()

    def clear_cart(self):
        self.items.all().delete()

    def get_total_price(self):
        return sum(item.get_total_price() for item in self.items.all())

    def process_to_purchase_order(self):
        if not self.items.exists():
            return None

        purchase_order = PurchaseOrder.objects.create(
            seller=self.items.first().item.owner,
            buyer=self.user,
            created_at=timezone.now()
        )

        for cart_item in self.items.all():
            PurchaseOrderItem.objects.create(
                purchase_order=purchase_order,
                item=cart_item.item,
                quantity=cart_item.quantity
            )

        self.clear_cart()
        return purchase_order

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    item = models.ForeignKey(Item, related_name='cart_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.item.name} in cart of {self.cart.user.username}"
    
    def get_total_price(self):
        return self.item.price * self.quantity