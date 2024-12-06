from django.shortcuts import render, get_object_or_404, redirect
from craftify.models.item_controller import Item 
from craftify.models.cart_controller import Cart  
from craftify.forms.item_form import ItemForm
from craftify.forms.cart_form import AddToCartForm
from django.contrib import messages
from django.core.exceptions import PermissionDenied
from django.contrib.auth.decorators import login_required

def home(request):
    items = Item.objects.all()
    return render(request, 'home.html', {'items': items})

def list_items(request):
    items = Item.objects.all()
    return render(request, 'items/item_list.html', {'items': items})

def item_detail(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    form = AddToCartForm(initial={'quantity': 1})
    context = {
        'item': item,
        'form': form,
    }
    return render(request, 'item_detail.html', context)

@login_required
def create_item(request):
    if request.method == 'POST':
        form = ItemForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Item created successfully.')
            return redirect('list_items')
    else:
        form = ItemForm()
    return render(request, 'items/item_form.html', {'form': form})

@login_required
def update_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    if item.owner != request.user:
        raise PermissionDenied
    if request.method == 'POST':
        form = ItemForm(request.POST, request.FILES, instance=item)
        if form.is_valid():
            form.save()
            messages.success(request, 'Item updated successfully.')
            return redirect('item_detail', item_id=item.id)
    else:
        form = ItemForm(instance=item)
    return render(request, 'items/item_form.html', {'form': form})

@login_required
def delete_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    if item.owner != request.user:
        raise PermissionDenied
    if request.method == 'POST':
        item.delete()
        messages.success(request, 'Item deleted successfully.')
        return redirect('list_items')
    return render(request, 'items/item_confirm_delete.html', {'item': item})

@login_required
def add_to_cart(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart.items.add(item)
    messages.success(request, 'Item added to cart.')
    return redirect('item_detail', item_id=item.id)

@login_required
def remove_from_cart(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    cart = get_object_or_404(Cart, user=request.user)
    cart.items.remove(item)
    messages.success(request, 'Item removed from cart.')
    return redirect('cart_detail')

@login_required
def cart_detail(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    return render(request, 'cart/cart_detail.html', {'cart': cart})

@login_required
def checkout(request):
    cart = get_object_or_404(Cart, user=request.user)
    if request.method == 'POST':
        order = PurchaseOrder.objects.create(buyer=request.user, total_amount=0)
        total_amount = 0
        for item in cart.items.all():
            order_item = PurchaseOrderItem.objects.create(
                purchase_order=order,
                item=item,
                quantity=1,  # Adjust if you have quantity in cart
                price=item.price
            )
            total_amount += item.price
        order.total_amount = total_amount
        order.save()
        cart.items.clear()
        messages.success(request, 'Checkout successful.')
        return redirect('order_detail', order_id=order.id)
    return render(request, 'cart/checkout.html', {'cart': cart})

@login_required
def order_detail(request, order_id):
    order = get_object_or_404(PurchaseOrder, id=order_id, buyer=request.user)
    return render(request, 'orders/order_detail.html', {'order': order})