from rest_framework import serializers
from .models import *
from .filters import clean_filters, FilterError


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = [
            "id",
            "name",
            "href",
            "src",
            "secondsPlayed",
            "duration",
            "thumbnail",
            "color",
            "date_created",
            "album",
            "tags",
        ]
        read_only_fields = ["date_created"]


class PlaylistSerializer(serializers.ModelSerializer):
    songs = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Song.objects.all(), required=False
    )

    class Meta:
        model = Playlist
        fields = ["id", "name", "songs", "playlist_type", "filters"]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # For filter playlists this looks the songs up from the filters, so it's always current
        rep["songs"] = SongSerializer(instance.get_songs(), many=True).data
        return rep

    def validate_filters(self, value):
        # what the filters can be is defined in filters.py; this stores only the ones that are on
        try:
            return clean_filters(value)
        except FilterError as e:
            raise serializers.ValidationError(str(e))

    def validate(self, attrs):
        current_type = self.instance.playlist_type if self.instance else Playlist.MANUAL
        playlist_type = attrs.get("playlist_type", current_type)

        if self.instance and playlist_type != current_type:
            raise serializers.ValidationError(
                {
                    "playlist_type": "A playlist's type can't be changed after it's created."
                }
            )

        if playlist_type == Playlist.FILTER:
            if attrs.get("songs"):
                raise serializers.ValidationError(
                    {
                        "songs": "Filter playlists don't hold songs; they're picked by their filters."
                    }
                )
            attrs.pop("songs", None)

            if not self.instance:
                attrs.setdefault("filters", {})
        elif attrs.get("filters"):
            raise serializers.ValidationError(
                {"filters": "Only filter playlists can have filters."}
            )

        return attrs

    def update(self, instance, validated_data):
        songs = validated_data.pop("songs", None)
        instance = super().update(instance, validated_data)
        if songs is not None:
            instance.songs.set(songs)
        return instance
