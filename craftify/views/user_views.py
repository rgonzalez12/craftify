from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model, authenticate, login
from craftify.forms.user_form import UserExtendedForm, UserProfileForm, UserContactForm

UserExtended = get_user_model()

def home(request):
    return render(request, 'home.html')

def signup(request):
    if request.method == 'POST':
        form = UserExtendedForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            login(request, user)  # Automatically log the user in after signup
            return redirect('profile', user_id=user.id)
    else:
        form = UserExtendedForm()
    return render(request, 'users/signup.html', {'form': form})

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
                return redirect('profile', user_id=user.id)
        else:
            profile_form = UserProfileForm(instance=user)
            contact_form = UserContactForm(instance=user)
        return render(request, 'users/edit_profile.html', {
            'profile_form': profile_form,
            'contact_form': contact_form,
            'user': user
        })
    else:
        return render(request, 'users/view_profile.html', {'user': user})

@login_required
def delete_user(request, user_id):
    user = get_object_or_404(UserExtended, pk=user_id)
    if request.method == 'POST':
        user.delete()
        return redirect('list_users')
    return render(request, 'users/delete.html', {'user': user})

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'users/login.html', {'error': 'Invalid username or password'})
    return render(request, 'users/login.html')