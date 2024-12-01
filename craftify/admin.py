from django.contrib import admin
from .models.user_ext_controller import UserExtended

@admin.register(UserExtended)
class UserExtendedAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'date_of_birth', 'phone_number', 'country_code', 'address')
