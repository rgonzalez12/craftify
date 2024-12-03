from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from .models.user_ext_controller import UserExtended
from .models import Review, Item, PurchaseOrder, PurchaseOrderItem, ReturnOrder

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
                # Remove 'profile_picture' and 'website' if not required
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
                # Remove 'profile_picture' and 'website' if not required
            ),
        }),
    )

    list_display = ('email', 'username', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')

    search_fields = ('email', 'username')
    ordering = ('email',)

# Register other models
admin.site.register(Review)
admin.site.register(Item)
admin.site.register(PurchaseOrder)
admin.site.register(PurchaseOrderItem)
admin.site.register(ReturnOrder)