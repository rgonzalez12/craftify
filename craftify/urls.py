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
    path('items/<int:pk>/edit/', item_views.update_item, name='item_edit'),
    path('items/<int:pk>/delete/', item_views.delete_item, name='item_delete')
]
