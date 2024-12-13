from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.contrib import messages
from craftify.models.item_controller import Item
from craftify.models.cart_controller import Cart 
from craftify.forms.item_form import ItemForm
from craftify.forms.cart_form import AddToCartForm

#from craftify.ml_utils import run_inference
#from PIL import Image
#import torchvision.transforms as transforms
#import io

def home(request):
    items = Item.objects.all()
    return render(request, 'home.html', {'items': items})

def list_items(request):
    items = Item.objects.all()
    return render(request, 'item_list.html', {'items': items})

def item_detail(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    form = AddToCartForm(initial={'quantity': 1})
    context = {
        'item': item,
        'form': form,
    }
    return render(request, 'item_detail.html', context)

@login_required
def my_items(request):
    items = Item.objects.filter(seller=request.user).order_by('-created_at')
    return render(request, 'my_items.html', {'items': items})

@login_required
def create_item(request):
    if request.method == 'POST':
        form = ItemForm(request.POST, request.FILES)
        if form.is_valid():
            new_item = form.save(commit=False)
            new_item.seller = request.user
            new_item.save()
            messages.success(request, 'Item created successfully.')
            return redirect('my_items')
        else:
            messages.error(request, 'There was an error creating the item.')
    else:
        form = ItemForm()
    return render(request, 'item_form.html', {'form': form})

@login_required
def update_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)

    if item.seller != request.user and not request.user.is_staff:
        raise PermissionDenied("You do not have permission to update this item.")

    if request.method == 'POST':
        form = ItemForm(request.POST, request.FILES, instance=item)
        if form.is_valid():
            form.save()
            messages.success(request, 'Item updated successfully.')
            return redirect('my_items')
        else:
            messages.error(request, 'There was an error updating the item.')
    else:
        form = ItemForm(instance=item)
    return render(request, 'item_form.html', {'form': form, 'item': item})

@login_required
def delete_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)

    if item.seller != request.user and not request.user.is_staff:
        raise PermissionDenied("You do not have permission to delete this item.")

    if request.method == 'POST':
        item.delete()
        messages.success(request, 'Item deleted successfully.')
        return redirect('my_items')
    return render(request, 'item_confirm_delete.html', {'item': item})

"""
@login_required
def classify_item_image(request):
    if request.method == 'POST' and 'item_image' in request.FILES:
        image_file = request.FILES['item_image']
        pil_image = Image.open(image_file).convert('RGB')

        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225])
        ])

        input_tensor = transform(pil_image).unsqueeze(0)

        prediction = run_inference(input_tensor)
        class_names = ['Class A', 'Class B']
        predicted_class = class_names[prediction]

        return render(request, 'classification_result.html', {'predicted_class': predicted_class})
    else:
        return render(request, 'upload_image.html')
"""