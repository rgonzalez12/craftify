from django.test import TestCase
from craftify.models.user_ext_controller import UserExtended
from django.core.exceptions import ValidationError

class UserExtendedModelTest(TestCase):
    def test_valid_phone_and_country_code(self):
        """Test valid phone number and country code."""
        user = UserExtended(
            username="testuser",
            phone_number=123456789012345,
            country_code="+123",
            password="securepassword123"
        )
        try:
            user.full_clean()  # Run all validations
            user.save()  # Save the instance if validation passes
        except ValidationError:
            self.fail("Validation unexpectedly failed for valid input.")

    def test_invalid_country_code(self):
        """Test invalid country code."""
        user = UserExtended(
            username="testuser",
            phone_number=123456789012345,
            country_code="123"  # Missing '+' sign
        )
        with self.assertRaises(ValidationError) as context:
            user.full_clean()  # Run validation
        self.assertIn('country_code', context.exception.message_dict)

    def test_invalid_phone_number(self):
        """Test invalid phone number (too short)."""
        user = UserExtended(
            username="testuser",
            phone_number=123456789,  # Too short
            country_code="+123"
        )
        with self.assertRaises(ValidationError) as context:
            user.full_clean()  # Run validation
        self.assertIn('phone_number', context.exception.message_dict)