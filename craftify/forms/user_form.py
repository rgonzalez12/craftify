from django import forms
from django.core.validators import RegexValidator, EmailValidator
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

UserExtended = get_user_model()

class UserExtendedForm(forms.ModelForm):
    email = forms.EmailField(
        required=True,
        validators=[EmailValidator(message='Enter a valid email address.')],
        widget=forms.EmailInput(attrs={'class': 'form-control'})
    )
    username = forms.CharField(
        max_length=150,
        validators=[
            RegexValidator(
                regex=r'^[\w.@+-]+$',
                message='Username may contain only letters, numbers, and @/./+/-/_ characters.'
            )
        ],
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    password1 = forms.CharField(
        label='Password',
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        validators=[validate_password],
        help_text="Password must be at least 8 characters long and contain at least one uppercase letter and one number."
    )
    password2 = forms.CharField(
        label='Confirm Password',
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        validators=[validate_password],
        help_text="Enter the same password as before, for verification."
    )
    date_of_birth = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
        required=True
    )
    drivers_license_number = forms.CharField(
        max_length=50,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        required=True
    )
    country_code = forms.CharField(
        max_length=10,
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        required=True
    )
    phone_number = forms.CharField(
        max_length=20,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ],
        widget=forms.TextInput(attrs={'class': 'form-control'}),
        required=True
    )

    class Meta:
        model = UserExtended
        fields = [
            'email',
            'username',
            'password1',
            'password2',
            'date_of_birth',
            'drivers_license_number',
            'country_code',
            'phone_number'
        ]

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")

        if password1 and password2:
            if password1 != password2:
                self.add_error('password2', "Passwords do not match.")
        
        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

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
        if UserExtended.objects.filter(email=email).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError("This email address is already in use.")
        return email

    def clean_phone_number(self):
        phone_number = self.cleaned_data.get('phone_number')
        if phone_number and UserExtended.objects.filter(phone_number=phone_number).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError("This phone number is already in use.")
        return phone_number
