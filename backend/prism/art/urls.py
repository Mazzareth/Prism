# art/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.artwork_list, name='artwork_list'),
    path('<int:pk>/', views.artwork_detail, name='artwork_detail'),
    path('create/', views.create_artwork, name='create_artwork'),
]