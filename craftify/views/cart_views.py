from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from craftify.models.cart_controller import Cart, CartItem
from craftify.models.item_controller import Item
from craftify.forms.cart_form import AddToCartForm, CartUpdateForm, CartRemoveForm
from django.contrib import messages

@login_required
def view_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    update_forms = {item.id: CartUpdateForm(prefix=str(item.id), instance=item) for item in cart.items.all()}
    remove_form = CartRemoveForm()
    context = {
        'cart': cart,
        'update_forms': update_forms,
        'remove_form': remove_form,
    }
    return render(request, 'cart/cart.html', context)

@login_required
def add_to_cart(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    cart, created = Cart.objects.get_or_create(user=request.user)
    if request.method == 'POST':
        form = AddToCartForm(request.POST, user=request.user)
        if form.is_valid():
            cart_item, created = CartItem.objects.get_or_create(cart=cart, item=item)
            cart_item.quantity += form.cleaned_data['quantity']
            cart_item.save()
            messages.success(request, f"Added {form.cleaned_data['quantity']} x {item.name} to your cart.")
            return redirect('item_detail', item_id=item_id)
    else:
        form = AddToCartForm(initial={'item': item})
    context = {
        'form': form,
        'item': item,
    }
    return render(request, 'item_detail.html', context)

@login_required
def remove_from_cart(request, item_id):
    if request.method == 'POST':
        form = CartRemoveForm(request.POST)
        if form.is_valid():
            item_id = form.cleaned_data['item_id']
            cart_item = get_object_or_404(CartItem, cart__user=request.user, item__id=item_id)
            cart_item.delete()
            messages.success(request, f"Removed {cart_item.item.name} from your cart.")
    return redirect('view_cart')

@login_required
def checkout(request):
    cart = get_object_or_404(Cart, user=request.user)
    
    if not cart.items.exists():
        messages.error(request, "Your cart is empty.")
        return redirect('view_cart')

    if request.method == 'POST':
        # Simulate payment process
        confirm_payment = True  #89-97 set up what could be actual business logic for a payment integrator
        if confirm_payment:
            # Create a new PurchaseOrder
            purchase_order = PurchaseOrder.objects.create(
                buyer=request.user,
                seller=cart.items.first().item.seller,  # Assuming all items have the same seller
                total_amount=cart.get_total_price()
            )

            # Create PurchaseOrderItems for each item in the cart
            for cart_item in cart.items.all():
                PurchaseOrderItem.objects.create(
                    purchase_order=purchase_order,
                    item=cart_item.item,
                    quantity=cart_item.quantity,
                    price=cart_item.item.price
                )

            # Clear the cart
            cart.items.all().delete()
            messages.success(request, "Checkout successful. Your order has been placed.")
            return redirect('home')
        else:
            messages.error(request, "Payment failed. Please try again.")
            return redirect('checkout')

    return render(request, 'cart/checkout.html', {'cart': cart})

def confirm_payment(request):
    # Simulate payment process
    return True