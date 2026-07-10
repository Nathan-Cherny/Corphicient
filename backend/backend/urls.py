"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to  For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from songs.views import *
from notes.views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('media/songs/<path:filename>/', serve_audio, name='serve_audio'),

    path('songs/', get_songs, name="get_songs"),
    path('add_song/', add_song, name='add_song'),
    path('get_song_form/', get_song_form, name='get_song_form'),
    path('delete_song/<int:pk>/', delete_song, name="delete_song"),
    path('songs/<int:pk>/update/', update_song, name="update_song"),
    path('songs/<int:pk>/add_time_played/', add_time_played, name="add_time_played"),
    path('songs/<int:pk>/crop/', crop_song, name="crop_song"),

    path('playlists/', get_playlists, name="get_playlists"),
    path('add_playlist/', add_playlist, name="get_playlists"),
    path('get_playlist_form/', get_playlist_form, name='get_playlist_form'),
    path('delete_playlist/<int:pk>/', delete_playlist, name="delete_playlist"),
    path("playlists/<int:pk>/update/", update_playlist, name="update_playlist"),

    path("get_sections/", get_sections, name="get_sections"),
    path("add_section/", add_section, name="add_section"),
    path("get_section_form/", get_section_form, name="get_section_form"),
    path("section/<int:pk>/add_note/", add_note_to_section, name="add_note_to_section"),

    path("add_note/", add_note, name="add_note"),
    path("get_note_form/", get_note_form, name="get_note_form"),
    path("delete_note/<int:pk>/", delete_note, name="delete_note"),
    path("note/<int:pk>/update/", update_note, name="update_note"),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
