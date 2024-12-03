from django import forms
from craftify.models.user_ext_controller import UserExtended

class UserExtendedForm(forms.ModelForm):
    class Meta:
        model = UserExtended
        fields = [
            'email', 'username', 'bio', 'date_of_birth', 'drivers_license_number',
            'phone_number', 'country_code', 'address'
        ]