from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Content, Tag, Following, Likes, ContentTag
from django.contrib.auth.hashers import make_password

User = get_user_model()

def lowercase_username_email(data):
    if 'username' in data:
        data['username'] = data['username'].lower()
    if 'email' in data:
        data['email'] = data['email'].lower()
    return data

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    access_token = serializers.CharField(read_only=True, required=False)
    refresh_token = serializers.CharField(read_only=True, required=False)
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_artist', 'access_token', 'refresh_token', 'profile_picture', 'bio']
    def to_internal_value(self, data):
        data = super().to_internal_value(data)
        return lowercase_username_email(data)

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

class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'is_artist', 'profile_picture', 'bio']

class ContentSerializer(serializers.ModelSerializer):
    artist = PublicUserSerializer(read_only=True)
    tags = serializers.SlugRelatedField(many=True, slug_field='name', queryset=Tag.objects.all())
    image = serializers.ImageField(required=True, allow_empty_file=False)

    class Meta:
        model = Content
        fields = ['id', 'artist', 'title', 'image', 'nsfw', 'created_at', 'tags']
        read_only_fields = ['artist']

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        if not isinstance(tags_data, list):
            raise serializers.ValidationError("Tags must be a list of strings")  # Explicitly check for list

        content = Content.objects.create(artist=self.context['request'].user, **validated_data)

        for tag_name in tags_data:
            if not isinstance(tag_name, str):  # Check if each tag is a string
                raise serializers.ValidationError("Each tag must be a string")
            tag, created = Tag.objects.get_or_create(name=tag_name.lower())
            ContentTag.objects.create(content=content, tag=tag)
        return content

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

    def to_internal_value(self, data):
        data = super().to_internal_value(data)
        if 'name' in data:
            data['name'] = data['name'].lower()
        return data

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

class ContentTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentTag
        fields = ['content', 'tag']

class FollowingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Following
        fields = ['user', 'artist', 'created_at']

    def to_internal_value(self, data):
        data = super().to_internal_value(data)
        if 'user' in data and isinstance(data['user'], dict):
            data['user'] = lowercase_username_email(data['user'])
        if 'artist' in data and isinstance(data['artist'], dict):
            data['artist'] = lowercase_username_email(data['artist'])
        return data

class LikesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Likes
        fields = ['user', 'content']