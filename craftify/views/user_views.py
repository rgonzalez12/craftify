from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import get_user_model
from craftify.forms.user_form import UserExtendedForm

UserExtended = get_user_model()

def list_users(request):
    users = UserExtended.objects.all()
    return render(request, 'users/list.html', {'users': users})

def user_detail(request, user_id):
    user = get_object_or_404(UserExtended, pk=user_id)
    return render(request, 'users/detail.html', {'user': user})

def create_user(request):
    if request.method == 'POST':
        form = UserExtendedForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('list_users')
    else:
        form = UserExtendedForm()
    return render(request, 'users/create.html', {'form': form})

def update_user(request, user_id):
    user = get_object_or_404(UserExtended, pk=user_id)
    if request.method == 'POST':
        form = UserExtendedForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            return redirect('user_detail', user_id=user.id)
    else:
        form = UserExtendedForm(instance=user)
    return render(request, 'users/update.html', {'form': form})

def delete_user(request, user_id):
    user = get_object_or_404(UserExtended, pk=user_id)
    if request.method == 'POST':
        user.delete()
        return redirect('list_users')
    return render(request, 'users/delete.html', {'user': user})