from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from craftify.models.cart_controller import Cart, CartItem
from craftify.models.item_controller import Item
from craftify.forms.cart_form import AddToCartForm, CartUpdateForm, CartRemoveForm
from django.contrib import messages

@login_required
def view_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart_items = cart.items.all()
    context = {
        'cart': cart,
        'cart_items': cart_items,
    }
    return render(request, 'cart.html', context)

@login_required
def add_to_cart(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    if request.method == 'POST':
        form = AddToCartForm(request.POST)
        if form.is_valid():
            quantity = form.cleaned_data['quantity']
            cart, created = Cart.objects.get_or_create(user=request.user)
            cart_item, item_created = CartItem.objects.get_or_create(cart=cart, item=item)
            if not item_created:
                cart_item.quantity += quantity
            else:
                cart_item.quantity = quantity
            cart_item.save()
            messages.success(request, f"Added {quantity} x {item.name} to your cart.")
            return redirect('item_detail', item_id=item_id)
        else:
            # Form is invalid; render the item detail page with errors
            context = {
                'item': item,
                'form': form,
            }
            return render(request, 'item_detail.html', context)
    else:
        return redirect('item_detail', item_id=item_id)

@login_required
def remove_from_cart(request, item_id):
    cart = get_object_or_404(Cart, user=request.user)
    item = get_object_or_404(Item, id=item_id)
    cart_item = CartItem.objects.filter(cart=cart, item=item).first()
    if cart_item:
        cart_item.delete()
        messages.success(request, f"Removed {item.name} from your cart.")
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