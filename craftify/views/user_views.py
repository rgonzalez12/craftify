from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.contrib import messages
from craftify.forms.user_form import UserExtendedForm, UserProfileForm, UserContactForm
from django.core.exceptions import PermissionDenied

UserExtended = get_user_model()

def home(request):
    return render(request, 'home.html')

def signup(request):
    if request.method == 'POST':
        form = UserExtendedForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Signup successful. You are now logged in.')
            return redirect('home')
        else:
            messages.error(request, 'There was an error with your signup. Please try again.')
    else:
        form = UserExtendedForm()
    return render(request, 'signup.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid email or password.')
            return redirect('login')
    else:
        return render(request, 'login.html')

@login_required
def user_logout(request):
    logout(request)
    messages.success(request, 'You have been logged out.')
    return redirect('home')

@login_required
def list_users(request):
    if not request.user.is_staff:
        raise PermissionDenied("You do not have permission to view the user list.")
    users = UserExtended.objects.all()
    return render(request, 'list.html', {'users': users})

@login_required
def user_detail(request, user_id):
    user = get_object_or_404(UserExtended, pk=user_id)
    if not request.user.is_staff and request.user != user:
        raise PermissionDenied("You do not have permission to view this user's details.")
    return render(request, 'detail.html', {'user': user})

@login_required
def create_user(request):
    if not request.user.is_staff:
        raise PermissionDenied("You do not have permission to create a new user.")
    if request.method == 'POST':
        form = UserExtendedForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'User created successfully.')
            return redirect('list_users')
        else:
            messages.error(request, 'There was an error creating the user.')
    else:
        form = UserExtendedForm()
    return render(request, 'create.html', {'form': form})

@login_required
def update_user(request, user_id):
    user = get_object_or_404(UserExtended, pk=user_id)
    if request.user != user and not request.user.is_staff:
        raise PermissionDenied("You do not have permission to update this user.")

    if request.method == 'POST':
        form = UserExtendedForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            messages.success(request, 'User updated successfully.')
            return redirect('user_detail', user_id=user.id)
        else:
            messages.error(request, 'There was an error updating the user.')
    else:
        form = UserExtendedForm(instance=user)
    return render(request, 'update.html', {'form': form})

@login_required
def delete_user(request, user_id):
    user = get_object_or_404(UserExtended, pk=user_id)
    if request.user != user and not request.user.is_staff:
        raise PermissionDenied("You do not have permission to delete this user.")

    if request.method == 'POST':
        user.delete()
        messages.success(request, 'User deleted successfully.')
        return redirect('list_users')
    return render(request, 'delete.html', {'user': user})

@login_required
def profile(request, user_id):
    user = get_object_or_404(UserExtended, pk=user_id)
    if request.user == user:
        if request.method == 'POST':
            profile_form = UserProfileForm(request.POST, request.FILES, instance=user)
            contact_form = UserContactForm(request.POST, instance=user)
            if profile_form.is_valid() and contact_form.is_valid():
                profile_form.save()
                contact_form.save()
                messages.success(request, 'Profile updated successfully.')
                return redirect('profile', user_id=user.id)
            else:
                messages.error(request, 'There was an error updating your profile.')
        else:
            profile_form = UserProfileForm(instance=user)
            contact_form = UserContactForm(instance=user)
        return render(request, 'edit_profile.html', {
            'profile_form': profile_form,
            'contact_form': contact_form,
            'user': user
        })
    else:
        return render(request, 'view_profile.html', {'user': user})