from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView # Import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('art/', include('art.urls')),
    path('', TemplateView.as_view(template_name='home.html'), name='home'), # New URL pattern for /
]