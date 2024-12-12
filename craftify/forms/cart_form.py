from django import forms
from craftify.models.cart_controller import CartItem

class AddToCartForm(forms.Form):
    quantity = forms.IntegerField(
        min_value=1,
        initial=1,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'id': 'quantity-input'})
    )


class CartUpdateForm(forms.ModelForm):
    class Meta:
        model = CartItem
        fields = ['quantity']
        widgets = {
            'quantity': forms.NumberInput(attrs={
                'class': 'form-input',
                'min': '1',
                'step': '1'
            }),
        }


class CartRemoveForm(forms.Form):
    item_id = forms.IntegerField(widget=forms.HiddenInput())