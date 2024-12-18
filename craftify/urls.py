from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from craftify.views import item_views, user_views, cart_views
from craftify.views.api_views import (
    ItemViewSet,
    SignupView,
    UserProfileView,
    UserDeleteView,
    CartView,
    AddToCartView,
    RemoveFromCartView
)

router = DefaultRouter()
router.register('items', ItemViewSet, basename='items')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/user/<int:id>/', UserProfileView.as_view(), name='user_profile'),
    path('api/users/<int:id>/', UserDeleteView.as_view(), name='user_delete'),
    path('api/cart/', CartView.as_view(), name='cart'),
    path('api/cart/add/<int:item_id>/', AddToCartView.as_view(), name='add_to_cart'),
    path('api/cart/items/<int:item_id>/', RemoveFromCartView.as_view(), name='remove_from_cart'),
    path('', item_views.home, name='home'),
    path('signup/', user_views.signup, name='signup'),
    path('login/', user_views.user_login, name='login'),
    path('logout/', user_views.user_logout, name='logout'),
    path('users/', user_views.list_users, name='list_users'),
    path('users/<int:user_id>/', user_views.user_detail, name='user_detail'),
    path('users/create/', user_views.create_user, name='create_user'),
    path('users/<int:user_id>/update/', user_views.update_user, name='update_user'),
    path('users/<int:user_id>/delete/', user_views.delete_user, name='delete_user'),
    path('profile/<int:user_id>/', user_views.profile, name='profile'),
    path('item/<int:item_id>/', item_views.item_detail, name='item_detail'),
    path('cart/', cart_views.view_cart, name='cart'),
    path('cart/add/<int:item_id>/', cart_views.add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:item_id>/', cart_views.remove_from_cart, name='remove_item'),
    path('checkout/', cart_views.checkout, name='checkout'),
    path('items/my/', item_views.my_items, name='my_items'),
    path('items/create/', item_views.create_item, name='item_create'),
    path('items/<int:item_id>/edit/', item_views.update_item, name='item_edit'),
    path('items/<int:item_id>/delete/', item_views.delete_item, name='item_delete'),
]