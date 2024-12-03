from django.db import models
from django.contrib.auth.models import AbstractUser

# Custom User Model
class User(AbstractUser):
    profile_picture = models.CharField(max_length=255, null=True, blank=True)
    is_artist = models.BooleanField(default=False)
    bio = models.TextField(null=True, blank=True)  # Added bio field

    def __str__(self):
        return self.username

# Content Model
class Content(models.Model):
    artist = models.ForeignKey(User, on_delete=models.CASCADE, related_name='content_items')
    title = models.CharField(max_length=255, null=True, blank=True)
    image = models.CharField(max_length=255, null=False, blank=False)
    nsfw = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['artist']),
        ]
    def __str__(self):
        return f"{self.title or 'Untitled'} by {self.artist.username}"

# Tag Model
class Tag(models.Model):
    name = models.CharField(max_length=255, unique=True, null=False, blank=False)

    def __str__(self):
        return self.name

# Content-Tag Join Table (represented as a ManyToMany field in Content model)
class ContentTag(models.Model):
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='content_tags')
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('content', 'tag')
        indexes = [
            models.Index(fields=['content']),
            models.Index(fields=['tag']),
        ]

    def __str__(self):
        return f"{self.content} - {self.tag}"

# Following Join Table
class Following(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following_users')
    artist = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followed_by_users')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'artist')
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['artist']),
        ]

    def __str__(self):
        return f"{self.user.username} follows {self.artist.username}"

# Likes Join Table
class Likes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='liked_content')
    content = models.ForeignKey(Content, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'content')
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['content']),
        ]

    def __str__(self):
        return f"{self.user.username} likes {self.content}"