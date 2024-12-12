"""
URL configuration for craftify project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from .views import item_views, user_views, cart_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', item_views.home, name='home'),  # Home view
    path('signup/', user_views.signup, name='signup'),  # User signup
    path('login/', user_views.user_login, name='login'),  # User login
    path('logout/', user_views.user_logout, name='logout'),  # User logout
    path('users/', user_views.list_users, name='list_users'),  # List all users
    path('users/<int:user_id>/', user_views.user_detail, name='user_detail'),  # User detail
    path('users/create/', user_views.create_user, name='create_user'),  # Create user
    path('users/<int:user_id>/update/', user_views.update_user, name='update_user'),  # Update user
    path('users/<int:user_id>/delete/', user_views.delete_user, name='delete_user'),  # Delete user
    path('profile/<int:user_id>/', user_views.profile, name='profile'),  # User profile
    path('item/<int:item_id>/', item_views.item_detail, name='item_detail'),  # Item detail view
    path('cart/', cart_views.view_cart, name='cart'),  # View cart
    path('cart/add/<int:item_id>/', cart_views.add_to_cart, name='add_to_cart'),  # Add to cart view
    path('cart/remove/<int:item_id>/', cart_views.remove_from_cart, name='remove_item'),  # Remove from cart view
    path('checkout/', cart_views.checkout, name='checkout'),  # Checkout view
]
