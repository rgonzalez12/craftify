from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from craftify.models.item_controller import Item
from craftify.serializers import ItemSerializer
from craftify.permissions import IsSellerOrReadOnly

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsSellerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)