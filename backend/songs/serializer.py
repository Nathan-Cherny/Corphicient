from rest_framework import serializers
from .models import *


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ["id", "name", "href", "src", "secondsPlayed"]
        read_only_fields = []


class PlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = ["id", "name", "songs"]
        read_only_fields = []