from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    CustomTokenRefreshView,
    MeView,
    ContentCreateView,
    ContentListView,
    ContentDetailView,
    ContentDeleteView,
    UserProfileView,
    UserUpdateView,
    ArtistProfileView,
    FollowArtistView,
    LikeContentView,
    TagListView,
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    # Authentication
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', MeView.as_view(), name='auth_me'),

    # Content
    path('content/', ContentCreateView.as_view(), name='content_create'),
    path('content/', ContentListView.as_view(), name='content_list'),
    path('content/<int:content_id>/', ContentDetailView.as_view(), name='content_detail'),
    path('content/<int:content_id>/delete/', ContentDeleteView.as_view(), name='content_delete'),

    # User/Artist
    path('users/<str:username>/', UserProfileView.as_view(), name='user_profile'),
    path('users/me/', UserUpdateView.as_view(), name='user_update'),
    path('artists/<str:username>/', ArtistProfileView.as_view(), name='artist_profile'),

    # Following/Liking
    path('following/<str:artist_username>/', FollowArtistView.as_view(), name='follow_artist'),
    path('likes/<int:content_id>/', LikeContentView.as_view(), name='like_content'),

    # Tagging
    path('tags/', TagListView.as_view(), name='tag_list'),
]