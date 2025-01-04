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

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def add_to_cart(self, request, item_id=None):
        try:
            item = Item.objects.get(id=item_id)
            cart, created = Cart.objects.get_or_create(user=request.user)
            quantity = int(request.data.get('quantity', 1))

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                item=item,
                defaults={'quantity': quantity}
            )

            if not created:
                cart_item.quantity += quantity
                cart_item.save()

            return Response({
                'message': 'Item added to cart successfully',
                'cart_item': CartItemSerializer(cart_item).data
            }, status=status.HTTP_200_OK)

        except Item.DoesNotExist:
            return Response(
                {'error': 'Item not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
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