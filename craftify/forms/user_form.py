from django import forms
from craftify.models.user_ext_controller import UserExtended
from django.core.validators import RegexValidator

class UserExtendedForm(forms.ModelForm):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={'class': 'form-input', 'placeholder': 'Enter your email'}),
    )
    username = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Enter your username'}),
        validators=[
            RegexValidator(
                regex=r'^[a-zA-Z0-9.@+-]+$',
                message='Username may contain only letters, numbers, and @/./+/-/_ characters.',
            ),
        ],
    )
    phone_number = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Enter your phone number'}),
        validators=[
            RegexValidator(
                regex=r'^\+?[1-9]\d{1,14}$',
                message='Enter a valid international phone number.',
            ),
        ],
    )

    class Meta:
        model = UserExtended
        fields = [
            'email', 'username', 'bio', 'date_of_birth', 'drivers_license_number',
            'phone_number', 'country_code', 'address', 'profile_picture', 'website'
        ]
        widgets = {
            'bio': forms.Textarea(attrs={'class': 'form-textarea', 'placeholder': 'Tell us about yourself'}),
            'date_of_birth': forms.DateInput(attrs={'class': 'form-input', 'type': 'date'}),
            'drivers_license_number': forms.TextInput(attrs={'class': 'form-input', 'placeholder': "Driver's license number"}),
            'country_code': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Country code'}),
            'address': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Your address'}),
            'profile_picture': forms.ClearableFileInput(attrs={'class': 'form-input'}),
            'website': forms.URLInput(attrs={'class': 'form-input', 'placeholder': 'Your website'}),
        }

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email and UserExtended.objects.filter(email=email).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError("This email address is already in use.")
        return email

    def clean_phone_number(self):
        phone_number = self.cleaned_data.get('phone_number')
        if phone_number and UserExtended.objects.filter(phone_number=phone_number).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError("This phone number is already in use.")
        return phone_number

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserExtended
        fields = ['bio', 'date_of_birth', 'profile_picture', 'website']
        widgets = {
            'bio': forms.Textarea(attrs={'class': 'form-textarea', 'placeholder': 'Tell us about yourself'}),
            'date_of_birth': forms.DateInput(attrs={'class': 'form-input', 'type': 'date'}),
            'profile_picture': forms.ClearableFileInput(attrs={'class': 'form-input'}),
            'website': forms.URLInput(attrs={'class': 'form-input', 'placeholder': 'Your website'}),
        }

class UserContactForm(forms.ModelForm):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={'class': 'form-input', 'placeholder': 'Enter your email'}),
    )
    phone_number = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Enter your phone number'}),
        validators=[
            RegexValidator(
                regex=r'^\+?[1-9]\d{1,14}$',
                message='Enter a valid international phone number.',
            ),
        ],
    )

    class Meta:
        model = UserExtended
        fields = ['phone_number', 'country_code', 'address', 'email']
        widgets = {
            'country_code': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Country code'}),
            'address': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Your address'}),
        }

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email and UserExtended.objects.filter(email=email).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError("This email address is already in use.")
        return email

    def clean_phone_number(self):
        phone_number = self.cleaned_data.get('phone_number')
        if phone_number and UserExtended.objects.filter(phone_number=phone_number).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError("This phone number is already in use.")
        return phone_number