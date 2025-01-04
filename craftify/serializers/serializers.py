from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from craftify.models.item_controller import Item, PurchaseOrder, PurchaseOrderItem
from craftify.models.address_controller import Address
from craftify.models.cart_controller import Cart, CartItem

User = get_user_model()

class ItemSerializer(serializers.ModelSerializer):
    seller_username = serializers.ReadOnlyField(source='seller.username')
    
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'price', 'quantity', 
                 'seller', 'seller_username', 'image', 'category', 'created_at']
        read_only_fields = ['id', 'seller', 'seller_username', 'created_at']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    total_price = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True,
        source='get_total_price'
    )

    class Meta:
        model = CartItem
        fields = ['item', 'quantity', 'total_price']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True,
        source='get_total_price'
    )

    class Meta:
        model = Cart
        fields = ['items', 'total_price']

class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    item_id = serializers.IntegerField(write_only=True)
    total_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True,
        source='get_total_price'
    )

    class Meta:
        model = PurchaseOrderItem
        fields = ['id', 'item', 'item_id', 'quantity', 'total_price']

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value

class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True,
        source='get_total_amount'
    )
    buyer = serializers.HiddenField(default=serializers.CurrentUserDefault())
    status = serializers.CharField(read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = ['id', 'buyer', 'items', 'total_amount', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        items_data = self.context.get('items', [])
        purchase_order = PurchaseOrder.objects.create(**validated_data)

        for item_data in items_data:
            PurchaseOrderItem.objects.create(
                purchase_order=purchase_order,
                **item_data
            )
        
        return purchase_order

    def update(self, instance, validated_data):
        items_data = self.context.get('items', [])
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if items_data:
            instance.items.all().delete()
            for item_data in items_data:
                PurchaseOrderItem.objects.create(
                    purchase_order=instance,
                    **item_data
                )
        
        instance.save()
        return instance