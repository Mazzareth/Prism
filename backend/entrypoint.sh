#!/bin/bash

# Create the Django project if it doesn't exist
if [ ! -d "prism_project" ]; then
  django-admin startproject prism_project .
fi

python manage.py makemigrations

# Apply database migrations
python manage.py migrate

# Create a core django app if it doesn't exist
if [ ! -d "core" ]; then
  python manage.py startapp core
fi

# Start the development server
python manage.py runserver 0.0.0.0:8000