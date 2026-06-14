"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from songs import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('songs/', views.get_songs, name="get_songs"),
    path('media/songs/<path:filename>/', views.serve_audio, name='serve_audio'),
    path('add_song/', views.add_song, name='add_song'),
    path('get_song_form/', views.get_song_form, name='get_song_form'),
    path('delete_song/<int:pk>/', views.delete_song, name="delete_song"),
    path('songs/<int:pk>/add_time_played/', views.add_time_played, name="add_time_played"),
    path('playlists/', views.get_playlists, name="get_playlists"),
    path('add_playlist/', views.add_playlist, name="get_playlists"),
    path('get_playlist_form/', views.get_playlist_form, name='get_playlist_form'),
    path("playlists/<int:pk>/update/", views.update_playlist, name="update_playlist"),
    path('delete_playlist/<int:pk>/', views.delete_playlist, name="delete_playlist"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
