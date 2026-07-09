from rest_framework import serializers
from .models import *


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ["id", "name", "href", "src", "secondsPlayed", "duration"]
        read_only_fields = []


class PlaylistSerializer(serializers.ModelSerializer):
    songs = serializers.PrimaryKeyRelatedField(many=True, queryset=Song.objects.all(), required=False)
    
    class Meta:
        model = Playlist
        fields = ["id", "name", "songs"]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["songs"] = SongSerializer(instance.songs.all(), many=True).data
        return rep

    def update(self, instance, validated_data):
        songs = validated_data.pop("songs", None)
        instance = super().update(instance, validated_data)
        if songs is not None:
            instance.songs.set(songs)
        return instance