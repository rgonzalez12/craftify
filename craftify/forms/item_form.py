from django import forms
from craftify.models.item_controller import Item, PurchaseOrder, PurchaseOrderItem, Review

class ItemForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = ['name', 'description', 'price', 'quantity', 'seller'] 
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Enter item name'}),
            'description': forms.Textarea(attrs={'class': 'form-textarea', 'placeholder': 'Enter item description'}),
            'price': forms.NumberInput(attrs={'class': 'form-input', 'min': '0', 'step': '0.01'}),
            'image': forms.ClearableFileInput(attrs={'class': 'form-input'}),
            'category': forms.Select(attrs={'class': 'form-select'}),
        }

    def clean_price(self):
        price = self.cleaned_data.get('price')
        if price is not None and price <= 0:
            raise forms.ValidationError("Price must be greater than zero.")
        return price

class PurchaseOrderForm(forms.ModelForm):
    class Meta:
        model = PurchaseOrder
        fields = ['seller', 'buyer', 'total_amount']
        widgets = {
            'seller': forms.HiddenInput(),
            'buyer': forms.HiddenInput(),
            'total_amount': forms.HiddenInput(),
        }

    def __init__(self, *args, **kwargs):
        self.seller = kwargs.pop('seller', None)
        self.buyer = kwargs.pop('buyer', None)
        super().__init__(*args, **kwargs)

    def save(self, commit=True):
        instance = super().save(commit=False)
        if self.seller:
            instance.seller = self.seller
        if self.buyer:
            instance.buyer = self.buyer
        if commit:
            instance.save()
        return instance

class PurchaseOrderItemForm(forms.ModelForm):
    class Meta:
        model = PurchaseOrderItem
        fields = ['item', 'quantity']
        widgets = {
            'item': forms.HiddenInput(),
            'quantity': forms.NumberInput(attrs={'class': 'form-input', 'min': '1', 'step': '1'}),
        }

    def __init__(self, *args, **kwargs):
        self.purchase_order = kwargs.pop('purchase_order', None)
        super().__init__(*args, **kwargs)

    def clean_quantity(self):
        quantity = self.cleaned_data.get('quantity')
        if quantity is not None and quantity < 1:
            raise forms.ValidationError("Quantity must be at least 1.")
        return quantity

    def save(self, commit=True):
        instance = super().save(commit=False)
        if self.purchase_order:
            instance.purchase_order = self.purchase_order
        instance.price = instance.item.price * instance.quantity
        if commit:
            instance.save()
        return instance

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['rating', 'comment']
        widgets = {
            'rating': forms.NumberInput(attrs={'class': 'form-input', 'min': '1', 'max': '5'}),
            'comment': forms.Textarea(attrs={'class': 'form-textarea', 'placeholder': 'Write your review...'}),
        }

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        self.reviewee = kwargs.pop('reviewee', None)
        super().__init__(*args, **kwargs)

    def save(self, commit=True):
        instance = super().save(commit=False)
        if self.user:
            instance.user = self.user
        if self.reviewee:
            instance.reviewee = self.reviewee
        if commit:
            instance.save()
        return instance