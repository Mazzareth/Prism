from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from .models import Content, Tag, Following, Likes  # Import your models

User = get_user_model()

# Register your models here.
admin.site.register(Content)
admin.site.register(Tag)
admin.site.register(Following)
admin.site.register(Likes)

class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'username', 'email', 'is_artist', 'is_staff')
    list_filter = ('is_artist', 'is_staff')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('email', 'profile_picture', 'is_artist')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
    (None, {
        'classes': ('wide',),
        'fields': ('username', 'email', 'password','is_artist'),
        }),
    )

#admin.site.register(User, CustomUserAdmin)