from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from craftify.models.item_controller import (
    Item,
    PurchaseOrder,
    PurchaseOrderItem
)
from craftify.models.cart_controller import Cart, CartItem
from craftify.serializers.serializers import (
    ItemSerializer,
    UserProfileSerializer,
    CartSerializer,
    CartItemSerializer,
    PurchaseOrderSerializer,
    PurchaseOrderItemSerializer
)
from craftify.permissions import IsSellerOrReadOnly, IsOwnerOrReadOnly

User = get_user_model()

class BaseModelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

    @action(detail=True, methods=['post'])
    def add_to_cart(self, request, pk=None):
        item = self.get_object()
        cart, _ = Cart.objects.get_or_create(user=request.user)
        quantity = int(request.data.get('quantity', 1))
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            item=item,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
            
        return Response({'status': 'Item added to cart'})

class CartViewSet(BaseModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def checkout(self, request, pk=None):
        cart = self.get_object()
        if not cart.items.exists():
            return Response(
                {'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )

        purchase_order = PurchaseOrder.objects.create(
            buyer=request.user,
            status='pending'
        )

        for cart_item in cart.items.all():
            PurchaseOrderItem.objects.create(
                purchase_order=purchase_order,
                item=cart_item.item,
                quantity=cart_item.quantity,
                price=cart_item.item.price
            )

        cart.items.all().delete()
        return Response(
            PurchaseOrderSerializer(purchase_order).data,
            status=status.HTTP_201_CREATED
        )

class PurchaseOrderViewSet(BaseModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return PurchaseOrder.objects.filter(buyer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)

class PurchaseOrderItemViewSet(BaseModelViewSet):
    queryset = PurchaseOrderItem.objects.all()
    serializer_class = PurchaseOrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PurchaseOrderItem.objects.filter(
            purchase_order__buyer=self.request.user
        )

class TokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    lookup_field = 'id'

class SignupView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                UserProfileSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )