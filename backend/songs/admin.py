from django.contrib import admin
from .models import *

@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ('name', 'src', 'thumbnail',)
    search_fields = ('name',)

@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)