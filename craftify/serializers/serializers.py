from rest_framework import serializers
from craftify.models.item_controller import Item

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