from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from .models import Content, Tag, Following, Likes  # Import your models

User = get_user_model()

# Custom ModelAdmin for Content
class ContentAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'created_at', 'nsfw')
    list_filter = ('artist', 'nsfw', 'created_at')
    search_fields = ('title', 'artist__username')
    fieldsets = (
        (None, {
            'fields': ('artist', 'title', 'image', 'nsfw')
        }),
        ('Date Information', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at',)

# Custom ModelAdmin for Tag
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# Custom ModelAdmin for Following
class FollowingAdmin(admin.ModelAdmin):
    list_display = ('user', 'artist', 'created_at')
    list_filter = ('user', 'artist', 'created_at')
    readonly_fields = ('created_at',)

# Custom ModelAdmin for Likes
class LikesAdmin(admin.ModelAdmin):
    list_display = ('user', 'content')
    list_filter = ('user', 'content__title')

# Custom User Admin
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
            'fields': ('username', 'email', 'password', 'is_artist'),
        }),
    )

# Register your models with their custom ModelAdmin classes
admin.site.register(User, CustomUserAdmin)
admin.site.register(Content, ContentAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Following, FollowingAdmin)
admin.site.register(Likes, LikesAdmin)