from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from craftify.models.item_controller import Item
from craftify.models.cart_controller import Cart, CartItem
from craftify.serializers.serializers import ItemSerializer, UserProfileSerializer
from craftify.permissions import IsSellerOrReadOnly
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

class TokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]        

class SignupView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        print('email', 'username')
        if not email or not username or not password:
            return Response({'error': 'email, username, and password are required'},
                            status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, id):
        return get_object_or_404(User, pk=id)

    def get(self, request, id, *args, **kwargs):
        user = self.get_object(id)
        if user != request.user and not request.user.is_staff:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id, *args, **kwargs):
        user = self.get_object(id)
        if user != request.user and not request.user.is_staff:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, id):
        return get_object_or_404(User, pk=id)

    def delete(self, request, id, *args, **kwargs):
        user = self.get_object(id)
        if user != request.user and not request.user.is_staff:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        cart, created = Cart.objects.get_or_create(user=request.user)
        items = cart.items.all()
        data = []
        for ci in items:
            data.append({
                'item': {
                    'id': ci.item.id,
                    'name': ci.item.name,
                    'price': ci.item.price
                },
                'quantity': ci.quantity,
                'get_total_price': ci.item.price * ci.quantity
            })
        return Response({'items': data}, status=status.HTTP_200_OK)


class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, item_id, *args, **kwargs):
        quantity = request.data.get('quantity', 1)
        item = get_object_or_404(Item, pk=item_id)
        cart, created = Cart.objects.get_or_create(user=request.user)
        cart_item, item_created = CartItem.objects.get_or_create(cart=cart, item=item)
        if not item_created:
            cart_item.quantity += int(quantity)
        else:
            cart_item.quantity = int(quantity)
        cart_item.save()
        return Response({'message': 'Item added to cart'}, status=status.HTTP_200_OK)


class RemoveFromCartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id, *args, **kwargs):
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = CartItem.objects.filter(cart=cart, item__id=item_id).first()
        if cart_item:
            cart_item.delete()
            return Response({'message': 'Item removed from cart'}, status=status.HTTP_200_OK)
        return Response({'error': 'Item not in cart'}, status=status.HTTP_400_BAD_REQUEST)