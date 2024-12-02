from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from .models import Content, Tag, Following, Likes, ContentTag

User = get_user_model()

# Existing User Serializer (modified for update)
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)  # Allow password to be optional for updates
    access_token = serializers.CharField(read_only=True, required=False) # Allow access_token to be optional for updates
    refresh_token = serializers.CharField(read_only=True, required=False) # Allow refresh_token to be optional for updates

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_artist', 'access_token', 'refresh_token', 'profile_picture']

    def create(self, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        user = User.objects.create(**validated_data)
        tokens = self.get_tokens_for_user(user)
        user.access_token = tokens['access']
        user.refresh_token = tokens['refresh']
        return user

    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

# Public User Serializer (for viewing profiles)
class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'is_artist', 'profile_picture']

# Content Serializer
class ContentSerializer(serializers.ModelSerializer):
    artist = PublicUserSerializer(read_only=True)  # Nest the public user details
    tags = serializers.SlugRelatedField(many=True, slug_field='name', queryset=Tag.objects.all())

    class Meta:
        model = Content
        fields = ['id', 'artist', 'title', 'image', 'nsfw', 'created_at', 'tags']
        read_only_fields = ['artist'] # Prevent artist from being directly updatable

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        content = Content.objects.create(artist=self.context['request'].user, **validated_data)
        for tag_name in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            ContentTag.objects.create(content=content, tag=tag)
        return content

# Tag Serializer
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

# Artist Serializer (for detailed artist info)
class ArtistSerializer(serializers.ModelSerializer):
    content_items = ContentSerializer(many=True, read_only=True)
    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'is_artist', 'profile_picture', 'content_items', 'followers', 'following']

    def get_followers(self, obj):
        return obj.followed_by_users.count()

    def get_following(self, obj):
        return obj.following_users.count()

# Content Tag Join Table Serializer - Helper Serializer not directly exposed through API
class ContentTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentTag
        fields = ['content', 'tag']

# Following Serializer - Helper Serializer not directly exposed through API
class FollowingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Following
        fields = ['user', 'artist', 'created_at']

# Likes Serializer - Helper Serializer not directly exposed through API
class LikesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Likes
        fields = ['user', 'content']