from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator

class Address(models.Model):

    street = models.CharField(
        max_length=255,
        null=False,
        blank=False,
        help_text="Enter your street address"
    )

    city = models.CharField(
        max_length=100,
        null=False,
        blank=False,
        help_text="Enter your city"
    )

    state = models.CharField(
        max_length=100,
        null=False,
        blank=False,
        help_text="Enter your state or province"
    )

    postal_code = models.CharField(
        max_length=20,
        null=False,
        blank=False,
        validators=[RegexValidator(
            regex=r'^\d{5}(-\d{4})?$',  # Simple U.S. postal code validation (5 digits or 5+4 digits)
            message="Enter a valid postal code (e.g., 62701 or 62701-1234)."
        )],
        help_text="Enter your postal code"
    )

    country = models.CharField(
        max_length=100,
        null=False,
        blank=False,
        help_text="Enter your country"
    )

    def clean(self):
        """Ensure all address fields are filled if address is provided."""
        if not (self.street and self.city and self.state and self.postal_code and self.country):
            raise ValidationError("All address fields (street, city, state, postal code, and country) must be filled.")
        return super().clean()

    def __str__(self):
        return f"{self.street}, {self.city}, {self.state}, {self.postal_code}, {self.country}"

    class Meta:
        verbose_name = "Address"
        verbose_name_plural = "Addresses"

    