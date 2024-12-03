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
from .views import user_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', user_views.home, name='home'),  # Home view
    path('users/', user_views.list_users, name='list_users'),
    path('users/<int:user_id>/', user_views.user_detail, name='user_detail'),
    path('users/create/', user_views.create_user, name='create_user'),
    path('users/<int:user_id>/update/', user_views.update_user, name='update_user'),
    path('users/<int:user_id>/delete/', user_views.delete_user, name='delete_user'),  # Corrected line
    path('signup/', user_views.signup, name='signup'),
    path('profile/<int:user_id>/', user_views.profile, name='profile'),
]

