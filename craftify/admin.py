from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from .models.user_ext_controller import UserExtended
from .models import Review, Item

admin.site.unregister(Group)

@admin.register(UserExtended)
class UserExtendedAdmin(BaseUserAdmin):
   
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': (
                'bio',
                'date_of_birth',
                'drivers_license_number',
                'phone_number',
                'country_code',
                'address',
            ),
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': (
                'bio',
                'date_of_birth',
                'drivers_license_number',
                'phone_number',
                'country_code',
                'address',
            ),
        }),
    )

    list_display = BaseUserAdmin.list_display + ('date_of_birth',)

    search_fields = BaseUserAdmin.search_fields + ('phone_number', 'drivers_license_number')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'reviewee', 'content_object', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'reviewee__username', 'comment')

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'price', 'quantity', 'created_at')
    list_filter = ('created_at', 'price')
    search_fields = ('name', 'owner__username')