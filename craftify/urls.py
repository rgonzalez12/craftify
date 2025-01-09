from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from craftify.views import item_views, user_views, cart_views
from craftify.views.api_views import (
    ItemViewSet,
    SignupView,
    UserProfileView,
    PurchaseOrderViewSet,
    PurchaseOrderItemViewSet,
    CartViewSet,
    UserListView
)

# API Routes
router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'orders', PurchaseOrderViewSet)
router.register(r'order-items', PurchaseOrderItemViewSet)

api_urlpatterns = [
    path('', include(router.urls)),
    path('cart/add/<int:item_id>/', CartViewSet.as_view({'post': 'add_to_cart'}), name='cart-add-item'),
    path('cart/remove_from_cart/<int:item_id>/', CartViewSet.as_view({'delete': 'remove_from_cart'}), name='cart-remove-item'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', SignupView.as_view(), name='api_signup'),
    path('user/<int:id>/', UserProfileView.as_view(), name='api_user_profile'),
    path('users/', UserListView.as_view(), name='user-list')
]

# Frontend Routes
frontend_urlpatterns = [
    # Home
    path('', item_views.home, name='home'),
    
    # Authentication
    path('signup/', user_views.signup, name='signup'),
    path('login/', user_views.user_login, name='login'),
    path('logout/', user_views.user_logout, name='logout'),
    
    # User 
    path('profile/<int:user_id>/', user_views.profile, name='profile'),
    
    # Cart
    path('cart/', cart_views.view_cart, name='cart'),
    path('cart/add/<int:item_id>/', cart_views.add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:item_id>/', cart_views.remove_from_cart, name='remove_from_cart'),
    path('checkout/', cart_views.checkout, name='checkout'),
]

# Main URL Config
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_urlpatterns)),
    path('', include(frontend_urlpatterns)),
]