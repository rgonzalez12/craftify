from django import forms
from craftify.models.cart_controller import CartItem

class AddToCartForm(forms.ModelForm):
    quantity = forms.IntegerField(min_value=1, initial=1, widget=forms.NumberInput(attrs={'class': 'form-input', 'min': '1'}))
    
    class Meta:
        model = CartItem
        fields = ['item', 'quantity']
        widgets = {
            'item': forms.HiddenInput(),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super(AddToCartForm, self).__init__(*args, **kwargs)
        if user:
            self.user = user

    def save(self, commit=True):
        cart, created = Cart.objects.get_or_create(user=self.user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, item=self.cleaned_data['item'])
        cart_item.quantity += self.cleaned_data['quantity']
        if commit:
            cart_item.save()
        return cart_item

class CartUpdateForm(forms.ModelForm):
    class Meta:
        model = CartItem
        fields = ['quantity']
        widgets = {
            'quantity': forms.NumberInput(attrs={'class': 'form-input', 'min': '1', 'step': '1'}),
        }

class CartRemoveForm(forms.Form):
    item_id = forms.IntegerField(widget=forms.HiddenInput())
