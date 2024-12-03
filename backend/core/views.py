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
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from typing import Union

User = get_user_model()

# --- Authentication Views ---
class RegisterView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=UserSerializer,
        responses={
            201: openapi.Response('Created', UserSerializer),
            400: openapi.Response('Bad Request', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'username': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                    'email': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                    'password': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                }
            ))
        },
        tags=['Authentication']
    )
    def post(self, request):
        """
        Register a new user.

        Registers a new user with the provided username, email, and password.
        Returns the user data and tokens upon successful registration.
        """
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['username_or_email', 'password'],
            properties={
                'username_or_email': openapi.Schema(type=openapi.TYPE_STRING, description="Username or Email"),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description="Password", format=openapi.FORMAT_PASSWORD)
            }
        ),
        responses={
            200: openapi.Response('OK', UserSerializer),
            400: openapi.Response('Bad Request', openapi.Schema(
              type=openapi.TYPE_OBJECT,
              properties={
                  'error': openapi.Schema(type=openapi.TYPE_STRING)
              }
            )),
            401: openapi.Response('Unauthorized', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                }
            ))
        },
        tags=['Authentication']
    )
    def post(self, request):
        """
        Login an existing user.

        Authenticates a user with the provided username/email and password.
        Returns the user data and tokens upon successful authentication.
        """
        username_or_email = request.data.get('username_or_email')
        password = request.data.get('password')

        if not username_or_email or not password:
            return Response({'error': 'Please provide both username/email and password'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username_or_email, password=password)
        if user is None:
          user = self._authenticate_by_email(username_or_email, password)    

        if user:
            refresh = RefreshToken.for_user(user)
            data = UserSerializer(user).data
            data["refresh"] = str(refresh)
            data["access"] = str(refresh.access_token)
            return Response(data, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    def _authenticate_by_email(self, username_or_email: str, password: str) -> Union[User, None]:
      """ Helper function to check for authentication by email
      """
      try:
        user = User.objects.get(email=username_or_email)
        if user.check_password(password):
          return user
      except User.DoesNotExist:
        return None
      return None

class LogoutView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['refresh_token'],
            properties={
                'refresh_token': openapi.Schema(type=openapi.TYPE_STRING)
            }
        ),
        responses={
            200: openapi.Response('OK', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )),
            400: openapi.Response('Bad Request', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                }
            ))
        },
        tags=['Authentication']
    )
    def post(self, request):
        """
        Logout a user.

        Blacklists the provided refresh token to log the user out.
        """
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenRefreshView(TokenRefreshView):
    @swagger_auto_schema(tags=['Authentication'])
    def post(self, request, *args, **kwargs):
        """
        Refresh JWT access token.

        Takes a refresh token and returns a new access token.
        """
        return super().post(request, *args, **kwargs)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={200: UserSerializer},
        tags=['Authentication']
    )
    def get(self, request):
        """
        Get current user's profile.

        Returns the data of the currently authenticated user.
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# --- Content Views ---

class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    # ... any methods like get_queryset if you have overridden default behaviour
    @swagger_auto_schema(tags=['Tags'])
    def get(self, request, *args, **kwargs):
        """
        List tags.

        Retrieves a list of all available tags.
        """
        return super().get(request, *args, **kwargs)
    
    
class ContentCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @swagger_auto_schema(
        request_body=ContentSerializer,
        responses={
            201: openapi.Response('Created', ContentSerializer),
            400: openapi.Response('Bad Request', ContentSerializer)
        },
        tags=['Content']
    )
    def post(self, request):
        """
        Create new content.

        Allows authenticated users to create new content items.
        """
        serializer = ContentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContentListView(generics.ListAPIView):
    serializer_class = ContentSerializer
    pagination_class = PageNumberPagination

    @swagger_auto_schema(
      manual_parameters=[
          openapi.Parameter('nsfw', openapi.IN_QUERY, description="Filter by NSFW content (true/false)", type=openapi.TYPE_BOOLEAN),
          openapi.Parameter('search', openapi.IN_QUERY, description="Search by content title", type=openapi.TYPE_STRING),
          openapi.Parameter('tags', openapi.IN_QUERY, description="Filter by tags (comma-separated)", type=openapi.TYPE_STRING),
      ],
        tags=['Content']
    )
    def get_queryset(self):
        """
        List content items.

        Retrieves a paginated list of content items.
        Allows filtering by NSFW, search query, and tags.
        """
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
    @swagger_auto_schema(
        responses={
            200: openapi.Response('OK', ContentSerializer),
            404: openapi.Response('Not Found', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'detail': openapi.Schema(type=openapi.TYPE_STRING)}
            ))
        },
        tags=['Content']
    )
    def get(self, request, content_id):
        """
        Get content details.

        Retrieves details of a specific content item.
        """
        content = get_object_or_404(Content, id=content_id)
        serializer = ContentSerializer(content)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ContentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={
            204: openapi.Response('No Content'),
            403: openapi.Response('Forbidden', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'error': openapi.Schema(type=openapi.TYPE_STRING)}
            )),
            404: openapi.Response('Not Found', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'detail': openapi.Schema(type=openapi.TYPE_STRING)}
            ))
        },
        tags=['Content']
    )
    def delete(self, request, content_id):
        """
        Delete content.

        Allows the content owner to delete a specific content item.
        """
        content = get_object_or_404(Content, id=content_id)
        if content.artist != request.user:
            return Response({"error": "You do not have permission to delete this content."}, status=status.HTTP_403_FORBIDDEN)
        content.delete()
        return Response({"message": "Content deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

# --- User/Artist Views ---
class UserProfileView(APIView):
    @swagger_auto_schema(
        responses={
            200: openapi.Response('OK', PublicUserSerializer),
            404: openapi.Response('Not Found', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'detail': openapi.Schema(type=openapi.TYPE_STRING)}
            ))
        },
        tags=['User']
    )
    def get(self, request, username):
        """
        Get user profile.

        Retrieves the public profile of a specific user.
        """
        user = get_object_or_404(User, username=username)
        serializer = PublicUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @swagger_auto_schema(
        request_body=UserSerializer,
        responses={
            200: openapi.Response('OK', UserSerializer),
            400: openapi.Response('Bad Request', UserSerializer)
        },
        tags=['User']
    )
    def put(self, request):
        """
        Update user profile.

        Allows authenticated users to update their own profile.
        """
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ArtistProfileView(APIView):
    @swagger_auto_schema(
        responses={
            200: openapi.Response('OK', ArtistSerializer),
            404: openapi.Response('Not Found', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'detail': openapi.Schema(type=openapi.TYPE_STRING)}
            ))
        },
        tags=['Artist']  # Separate tag for Artist endpoints
    )
    def get(self, request, username):
        """
        Get artist profile.

        Retrieves the profile of a specific artist, including their content.
        """
        artist = get_object_or_404(User, username=username, is_artist=True)
        serializer = ArtistSerializer(artist)
        return Response(serializer.data, status=status.HTTP_200_OK)
# --- Following/Liking Views ---

class FollowArtistView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={
            201: openapi.Response('Created', FollowingSerializer),  # Return serializer data
            400: openapi.Response('Bad Request', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'error': openapi.Schema(type=openapi.TYPE_STRING)}
            )),
            404: openapi.Response('Not Found', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'detail': openapi.Schema(type=openapi.TYPE_STRING)}
            ))
        },
        tags=['Following']
    )
    def post(self, request, artist_username):
        """
        Follow an artist.

        Allows authenticated users to follow a specific artist.
        """
        artist = get_object_or_404(User, username=artist_username, is_artist=True)
        if artist == request.user:
            return Response({"error": "You cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)

        following, created = Following.objects.get_or_create(user=request.user, artist=artist)
        if created:
            serializer = FollowingSerializer(following) # Serialize the following object.
            return Response(serializer.data, status=status.HTTP_201_CREATED) # Return data, not message
        else:
            return Response({"error": "You are already following this artist."}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        responses={
            204: openapi.Response('No Content'), # Correct status code on successful deletion
            404: openapi.Response('Not Found', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'error': openapi.Schema(type=openapi.TYPE_STRING)}
            ))
        },
        tags=['Following']
    )
    def delete(self, request, artist_username):
        """
        Unfollow an artist.

        Allows authenticated users to unfollow a specific artist.
        """
        artist = get_object_or_404(User, username=artist_username, is_artist=True)
        try:
            following = Following.objects.get(user=request.user, artist=artist)
            following.delete()
            return Response(status=status.HTTP_204_NO_CONTENT) # Use correct 204 status
        except Following.DoesNotExist:
            return Response({"error": "You are not following this artist."}, status=status.HTTP_404_NOT_FOUND)

class LikeContentView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={
            201: openapi.Response('Created', LikesSerializer), # Return serializer data
            400: openapi.Response('Bad Request', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'error': openapi.Schema(type=openapi.TYPE_STRING)}
            )),
            404: openapi.Response('Not Found', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'detail': openapi.Schema(type=openapi.TYPE_STRING)}
            ))

        },
        tags=['Likes']
    )
    def post(self, request, content_id):
        """
        Like content.

        Allows authenticated users to like a specific content item.
        """
        content = get_object_or_404(Content, id=content_id)
        like, created = Likes.objects.get_or_create(user=request.user, content=content)
        if created:
            serializer = LikesSerializer(like) # Serialize like object
            return Response(serializer.data, status=status.HTTP_201_CREATED) # Return created like data
        else:
            return Response({"error": "You have already liked this content."}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        responses={
            204: openapi.Response('No Content'),  # 204 for successful delete
            404: openapi.Response('Not Found', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'error': openapi.Schema(type=openapi.TYPE_STRING)}
            ))
        },
        tags=['Likes']
    )
    def delete(self, request, content_id):
        """
        Unlike content.

        Allows authenticated users to unlike a specific content item.
        """
        content = get_object_or_404(Content, id=content_id)
        try:
            like = Likes.objects.get(user=request.user, content=content)
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT) # 204 status
        except Likes.DoesNotExist:
            return Response({"error": "You have not liked this content."}, status=status.HTTP_404_NOT_FOUND)