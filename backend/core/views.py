from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, get_user_model
from .serializers import UserSerializer, PublicUserSerializer, ContentSerializer, TagSerializer, ArtistSerializer, FollowingSerializer, LikesSerializer, ContentTagSerializer
from .models import Content, Tag, Following, Likes, ContentTag
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser

User = get_user_model()

# --- Authentication Views (Existing with Updates) ---
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username_or_email = request.data.get('username_or_email')
        password = request.data.get('password')

        if not username_or_email or not password:
            return Response({'error': 'Please provide both username/email and password'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username_or_email, password=password)
        if user is None:
            try:
                user = User.objects.get(email=username_or_email)
                if not user.check_password(password):
                    user = None
            except User.DoesNotExist:
                user = None

        if user:
            refresh = RefreshToken.for_user(user)
            data = UserSerializer(user).data
            data["refresh"] = str(refresh)
            data["access"] = str(refresh.access_token)
            return Response(data, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenRefreshView(TokenRefreshView):
    pass

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

# --- Content Views ---
class ContentCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = ContentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContentListView(generics.ListAPIView):
    serializer_class = ContentSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        queryset = Content.objects.all()
        nsfw = self.request.query_params.get('nsfw')
        search = self.request.query_params.get('search')
        tags = self.request.query_params.get('tags')

        if nsfw is not None:
            nsfw_bool = nsfw.lower() == 'true'
            queryset = queryset.filter(nsfw=nsfw_bool)

        if search:
            queryset = queryset.filter(
              Q(title__icontains=search)
            )

        if tags:
            tag_list = tags.split(',')
            queryset = queryset.filter(tags__name__in=tag_list)
        
        return queryset

class ContentDetailView(APIView):
    def get(self, request, content_id):
        content = get_object_or_404(Content, id=content_id)
        serializer = ContentSerializer(content)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ContentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, content_id):
        content = get_object_or_404(Content, id=content_id)
        if content.artist != request.user:
            return Response({"error": "You do not have permission to delete this content."}, status=status.HTTP_403_FORBIDDEN)
        content.delete()
        return Response({"message": "Content deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

# --- User/Artist Views ---
class UserProfileView(APIView):
    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        serializer = PublicUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)  # Allow partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ArtistProfileView(APIView):
    def get(self, request, username):
        artist = get_object_or_404(User, username=username, is_artist=True)
        serializer = ArtistSerializer(artist)
        return Response(serializer.data, status=status.HTTP_200_OK)

# --- Following/Liking Views ---
class FollowArtistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, artist_username):
        artist = get_object_or_404(User, username=artist_username, is_artist=True)
        if artist == request.user:
          return Response({"error": "You cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)
        
        following, created = Following.objects.get_or_create(user=request.user, artist=artist)
        if created:
            return Response({"message": f"You are now following {artist_username}."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "You are already following this artist."}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, artist_username):
        artist = get_object_or_404(User, username=artist_username, is_artist=True)
        try:
            following = Following.objects.get(user=request.user, artist=artist)
            following.delete()
            return Response({"message": f"You have unfollowed {artist_username}."}, status=status.HTTP_200_OK)
        except Following.DoesNotExist:
            return Response({"error": "You are not following this artist."}, status=status.HTTP_404_NOT_FOUND)
class LikeContentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, content_id):
        content = get_object_or_404(Content, id=content_id)
        like, created = Likes.objects.get_or_create(user=request.user, content=content)
        if created:
            return Response({"message": "Content liked."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "You have already liked this content."}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, content_id):
        content = get_object_or_404(Content, id=content_id)
        try:
            like = Likes.objects.get(user=request.user, content=content)
            like.delete()
            return Response({"message": "Content unliked."}, status=status.HTTP_200_OK)
        except Likes.DoesNotExist:
            return Response({"error": "You have not liked this content."}, status=status.HTTP_404_NOT_FOUND)

# --- Tagging Views ---
class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer