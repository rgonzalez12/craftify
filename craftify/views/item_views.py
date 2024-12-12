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
    return render(request, 'item_list.html', {'items': items})


def item_detail(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    # Provide an initial AddToCartForm with quantity=1 as a default
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
            new_item = form.save(commit=False)
            # If items have an owner field, assign it:
            # new_item.owner = request.user
            new_item.save()
            messages.success(request, 'Item created successfully.')
            return redirect('list_items')
    else:
        form = ItemForm()
    return render(request, 'item_form.html', {'form': form})


@login_required
def update_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    # Assuming item has an owner field:
    # if item.owner != request.user:
    #     raise PermissionDenied
    
    if request.method == 'POST':
        form = ItemForm(request.POST, request.FILES, instance=item)
        if form.is_valid():
            form.save()
            messages.success(request, 'Item updated successfully.')
            return redirect('item_detail', item_id=item.id)
    else:
        form = ItemForm(instance=item)
    return render(request, 'item_form.html', {'form': form})


@login_required
def delete_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    # if item.owner != request.user:
    #     raise PermissionDenied

    if request.method == 'POST':
        item.delete()
        messages.success(request, 'Item deleted successfully.')
        return redirect('list_items')
    return render(request, 'item_confirm_delete.html', {'item': item})