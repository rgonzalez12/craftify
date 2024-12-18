from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model
from craftify.models.item_controller import Item
from craftify.models.address_controller import Address
from craftify.models.cart_controller import Cart, CartItem

User = get_user_model()

class ItemSerializer(serializers.ModelSerializer):
    seller_username = serializers.ReadOnlyField(source='seller.username', read_only=True)
    class Meta:
        model = Item
        fields = [
            'id',
            'name',
            'description',
            'price',
            'quantity',
            'seller',
            'seller_username',
            'image',
            'category',
            'created_at'
        ]
        read_only_fields = ['id', 'seller', 'seller_username', 'created_at']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'id',
            'street',
            'city',
            'state',
            'postal_code',
            'country'
        ]
        read_only_fields = ['id']

class UserProfileSerializer(serializers.ModelSerializer):
    address = AddressSerializer(required=False)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'address',
            'bio',
            'country_code',
            'drivers_license_number',
            'phone_number',
            'date_of_birth',
            'profile_picture',
            'website',
            'password'
        ]
        read_only_fields = ['id', 'email', 'username']

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)
        password = validated_data.pop('password', None)

        if address_data is not None:
            if instance.address is None:
                instance.address = Address.objects.create(**address_data)
            else:
                for attr, value in address_data.items():
                    setattr(instance.address, attr, value)
                instance.address.save()

        if password:
            validated_data['password'] = make_password(password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class CartItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['item', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['items', 'total_price']

    def get_total_price(self, obj):
        total = 0
        for ci in obj.items.all():
            total += ci.item.price * ci.quantity
        return total