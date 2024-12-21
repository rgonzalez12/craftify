# Craftify

Craftify is an e-commerce platform designed to showcase and sell handcrafted items. Built with Django on the backend, combined with React for the frontend, Craftify provides robust user creation, custom user profiles, item management, cart functionality, and so much more.

## Table of Contents

1. Overview
2. Installation
3. Running the Application
4. App Navigation
5. Authentication and Authorization
6. Built With
7. Contributing
8. Authors
9. License


## 1. Overview

Craftify is an e-commerce solution specifically tailored for handmade products:

Custom User Model (UserExtended) that stores additional user attributes (bio, profile picture, etc.).
Item Management for creating, editing, and deleting handcrafted products users will sell.
Shopping Cart and Checkout functionalty with full payment integrator logic.
Profile Editing to let users update personal details, addresses, and contact info.
Craftify leverages Django’s robust ORM and is integrated with a React frontend for a seamless single-page application experience.

## 2. Installation

Clone the Repository:

```bash
git clone https://github.com/YourUsername/craftify.git
cd craftify
```

## Create and Activate a Virtual Environment (recommended):

```bash
python -m venv venv
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate     # On Windows
Install Dependencies:
```

```bash
pip install -r requirements.txt
```

This will install Django, Django REST Framework, SimpleJWT, and any other libraries needed by Craftify.

## Run Migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Create a Superuser (optional but recommended):

```bash
python manage.py createsuperuser
```

## 3. Running the Application

Start the Django Development Server:

```bash
python manage.py runserver
```

By default, the application will run on http://127.0.0.1:8000/.

Start Frontend:

Navigate to the frontend directory and run:

```bash
npm install
npm start
```

It typically runs on http://localhost:3000. Adjust the backend endpoints accordingly to communicate with http://127.0.0.1:8000/api/

## 4. App Navigation

### User Registration & Login

New users can sign up for an account
Existing users can log in to access protected features

### Viewing Items

Browse a list of handcrafted items.
See item details, price, and seller information.

### Managing Items

Authenticated users can create, edit, and delete their own items.
View your items in “My Items” section.

### Cart & Checkout

Users can add items to a personal cart, remove them, and proceed to a checkout process.
The cart can be accessed at /cart or /api/cart/.

### Profile Editing

Update profile details, including address, phone number, bio, or profile picture.
Edit profile page found at /profile/:id/edit_profile.

### Logout

Clears the user’s session or JWT token from localStorage/SessionStorage, returning them to a public view.

## 5. Authentication and Authorization

JWT (JSON Web Tokens) or Session: Depending on your setup, you can handle user authentication using tokens (/api/token/) or traditional sessions.
Custom UserExtended Model: Stores additional user fields (e.g., bio, date_of_birth, drivers_license_number) and uses email as the primary login field if USERNAME_FIELD='email'.
Permission Checks: Only owners or staff can modify items. Public users can browse and add to cart but must be signed in to purchase.

## 6. Built With

Django – Core backend framework for the project.

Django REST Framework – Creates a robust, flexible API for item and cart endpoints.

SimpleJWT – Handles JWT authentication for secure user sessions.

React – Used for a single-page frontend experience.

SQLite – Excellent choice for lightweight, relational DB that scales well with complex modeling.


## 7. Contributing

Bug reports and pull requests are welcome. This project aims to provide a friendly, collaborative environment, and contributors are expected to adhere to the Contributor Covenant code of conduct. I built this as a fun way to learn Python, and freshen up my skills with React.

## 8. Authors

Raymond Gonzalez – Creator & Maintainer

## 9. License

This project is provided as open source under the terms of the MIT License.