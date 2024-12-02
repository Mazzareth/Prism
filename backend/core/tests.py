import json
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import Content, Tag, Following, Likes
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class AuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('auth_register')
        self.login_url = reverse('auth_login')
        self.logout_url = reverse('auth_logout')
        self.me_url = reverse('auth_me')
        self.refresh_url = reverse('token_refresh')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword',
            'is_artist': False
        }
        self.artist_data = {
            'username': 'testartist',
            'email': 'artist@example.com',
            'password': 'artistpassword',
            'is_artist': True
        }

    def create_user(self, user_data):
        response = self.client.post(self.register_url, user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return response

    def login_user(self, user_data):
        response = self.client.post(self.login_url, {
          'username_or_email': user_data['username'],
          'password': user_data['password']
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.data

    def test_register_user(self):
        response = self.create_user(self.user_data)

    def test_register_artist(self):
        response = self.create_user(self.artist_data)

    def test_login_user(self):
        self.create_user(self.user_data)
        response_data = self.login_user(self.user_data)
        self.assertIn('refresh', response_data)
        self.assertIn('access', response_data)

    def test_login_artist(self):
      self.create_user(self.artist_data)
      response_data = self.login_user(self.artist_data)
      self.assertIn('refresh', response_data)
      self.assertIn('access', response_data)

    def test_login_with_email(self):
        self.create_user(self.user_data)
        response_data = self.login_user({**self.user_data, 'username_or_email': self.user_data['email']})
        self.assertIn('refresh', response_data)
        self.assertIn('access', response_data)

    def test_login_invalid_credentials(self):
        self.create_user(self.user_data)
        response = self.client.post(self.login_url, {'username_or_email': 'wronguser', 'password': 'wrongpassword'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_user(self):
        self.create_user(self.user_data)
        login_response_data = self.login_user(self.user_data)
        refresh_token = login_response_data['refresh']
        response = self.client.post(self.logout_url, {'refresh_token': refresh_token}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_me_view(self):
        self.create_user(self.user_data)
        login_response_data = self.login_user(self.user_data)
        access_token = login_response_data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user_data['username'])

    def test_refresh_token(self):
      self.create_user(self.user_data)
      login_response_data = self.login_user(self.user_data)
      refresh_token = login_response_data['refresh']
      response = self.client.post(self.refresh_url, {'refresh': refresh_token}, format='json')
      self.assertEqual(response.status_code, status.HTTP_200_OK)
      self.assertIn('access', response.data)

class ContentTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('auth_register')
        self.login_url = reverse('auth_login')
        self.content_create_url = reverse('content_create')
        self.content_list_url = reverse('content_list')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword',
            'is_artist': True
        }
        self.content_data = {
            'title': 'Test Content',
            'image': 'https://via.placeholder.com/150',
            'nsfw': False,
            'tags': ['tag1', 'tag2']
        }
        user_response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(user_response.status_code, status.HTTP_201_CREATED)

        login_response = self.client.post(self.login_url,{
          'username_or_email': self.user_data['username'],
          'password': self.user_data['password']
        }, format='json')

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.access_token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        self.user = User.objects.get(username=self.user_data['username'])

    def test_create_content(self):
        response = self.client.post(self.content_create_url, self.content_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Content.objects.count(), 1)
        self.assertEqual(Content.objects.first().title, 'Test Content')
        self.assertEqual(Tag.objects.count(), 2)

    def test_list_content(self):
        self.client.post(self.content_create_url, self.content_data, format='json')
        response = self.client.get(self.content_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_list_content_with_filter_nsfw(self):
        self.client.post(self.content_create_url, {**self.content_data, 'nsfw': True}, format='json')
        response = self.client.get(f'{self.content_list_url}?nsfw=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        response = self.client.get(f'{self.content_list_url}?nsfw=false')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)

    def test_list_content_with_search(self):
        self.client.post(self.content_create_url, self.content_data, format='json')
        response = self.client.get(f'{self.content_list_url}?search=Test')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        response = self.client.get(f'{self.content_list_url}?search=NonExistent')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)
    
    def test_list_content_with_tags_filter(self):
        self.client.post(self.content_create_url, self.content_data, format='json')
        response = self.client.get(f'{self.content_list_url}?tags=tag1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        response = self.client.get(f'{self.content_list_url}?tags=tag3')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)

    def test_content_detail(self):
        create_response = self.client.post(self.content_create_url, self.content_data, format='json')
        content_id = create_response.data['id']
        url = reverse('content_detail', kwargs={'content_id': content_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Content')

    def test_content_delete(self):
        create_response = self.client.post(self.content_create_url, self.content_data, format='json')
        content_id = create_response.data['id']
        delete_url = reverse('content_delete', kwargs={'content_id': content_id})
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Content.objects.count(), 0)

    def test_content_delete_unauthorized(self):
        # Create another user
        another_user_data = {
            'username': 'anotheruser',
            'email': 'another@example.com',
            'password': 'anotherpassword',
            'is_artist': True
        }
        self.client.post(self.register_url, another_user_data, format='json')
        login_response = self.client.post(self.login_url,{
          'username_or_email': another_user_data['username'],
          'password': another_user_data['password']
        }, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        another_user_token = login_response.data['access']

        # Create content with the original user
        create_response = self.client.post(self.content_create_url, self.content_data, format='json')
        content_id = create_response.data['id']

        # Try to delete with another user
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {another_user_token}')
        delete_url = reverse('content_delete', kwargs={'content_id': content_id})
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Content.objects.count(), 1)

class UserArtistTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('auth_register')
        self.login_url = reverse('auth_login')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword',
            'is_artist': False
        }
        self.artist_data = {
            'username': 'testartist',
            'email': 'artist@example.com',
            'password': 'artistpassword',
            'is_artist': True
        }
        self.content_data = {
            'title': 'Test Content',
            'image': 'https://via.placeholder.com/150',
            'nsfw': False,
            'tags': ['tag1']
        }
        self.user_response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(self.user_response.status_code, status.HTTP_201_CREATED)
        self.artist_response = self.client.post(self.register_url, self.artist_data, format='json')
        self.assertEqual(self.artist_response.status_code, status.HTTP_201_CREATED)

        self.user_login_response = self.client.post(self.login_url,{
          'username_or_email': self.user_data['username'],
          'password': self.user_data['password']
        }, format='json')

        self.artist_login_response = self.client.post(self.login_url,{
            'username_or_email': self.artist_data['username'],
            'password': self.artist_data['password']
        }, format='json')
        self.assertEqual(self.user_login_response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.artist_login_response.status_code, status.HTTP_200_OK)
        self.user_access_token = self.user_login_response.data['access']
        self.artist_access_token = self.artist_login_response.data['access']

        self.user = User.objects.get(username=self.user_data['username'])
        self.artist = User.objects.get(username=self.artist_data['username'])

    def test_user_profile_view(self):
        url = reverse('user_profile', kwargs={'username': self.user_data['username']})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user_data['username'])
        self.assertEqual(response.data['is_artist'], False)

    def test_artist_profile_view(self):
        #Create content for the artist
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.artist_access_token}')
        self.client.post(reverse('content_create'), self.content_data, format='json')
        self.client.credentials()
        url = reverse('artist_profile', kwargs={'username': self.artist_data['username']})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.artist_data['username'])
        self.assertEqual(response.data['is_artist'], True)
        self.assertEqual(len(response.data['content_items']), 1)

    def test_user_update_view(self):
        url = reverse('user_update')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_access_token}')
        update_data = {'first_name': 'Test', 'last_name': 'User', 'profile_picture': 'test.jpg'}
        response = self.client.put(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.get(username=self.user_data['username']).first_name, 'Test')


class FollowingLikingTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('auth_register')
        self.login_url = reverse('auth_login')
        self.content_create_url = reverse('content_create')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword',
            'is_artist': False  # User is not an artist initially
        }
        self.artist_data = {
            'username': 'testartist',
            'email': 'artist@example.com',
            'password': 'artistpassword',
            'is_artist': True
        }
        self.content_data = {
            'title': 'Test Content',
            'image': 'https://via.placeholder.com/150',
            'nsfw': False,
            'tags': ['tag1']
        }

        self.client.post(self.register_url, self.user_data, format='json')
        self.client.post(self.register_url, self.artist_data, format='json')

        self.user_login_response = self.client.post(self.login_url, {'username_or_email': self.user_data['username'], 'password': self.user_data['password']}, format='json')
        self.artist_login_response = self.client.post(self.login_url, {'username_or_email': self.artist_data['username'], 'password': self.artist_data['password']}, format='json')
       
        self.user_access_token = self.user_login_response.data['access']
        self.artist_access_token = self.artist_login_response.data['access']

        self.user = User.objects.get(username=self.user_data['username'])
        self.artist = User.objects.get(username=self.artist_data['username'])

        # Create content as the artist
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.artist_access_token}')
        self.content_create_response = self.client.post(self.content_create_url, self.content_data, format='json')
        self.content = Content.objects.get(id=self.content_create_response.data['id'])

        self.client.credentials() # Clear credentials

    def test_follow_artist(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_access_token}')
        url = reverse('follow_artist', kwargs={'artist_username': self.artist_data['username']})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Following.objects.count(), 1)

    def test_unfollow_artist(self):
      # Set up following first
      self.test_follow_artist()

      self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_access_token}')
      url = reverse('follow_artist', kwargs={'artist_username': self.artist_data['username']})
      response = self.client.delete(url)
      self.assertEqual(response.status_code, status.HTTP_200_OK)
      self.assertEqual(Following.objects.count(), 0)

    def test_like_content(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_access_token}')
        url = reverse('like_content', kwargs={'content_id': self.content.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Likes.objects.count(), 1)

    def test_unlike_content(self):
        # Set up liking relationship first
        self.test_like_content()

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_access_token}')
        url = reverse('like_content', kwargs={'content_id': self.content.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Likes.objects.count(), 0)

class TagTests(APITestCase):
    def setUp(self):
        self.tag_list_url = reverse('tag_list')

    def test_tag_list(self):
        Tag.objects.create(name='tag1')
        Tag.objects.create(name='tag2')
        response = self.client.get(self.tag_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)