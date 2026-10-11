from rest_framework import serializers
from django.utils.dateparse import parse_date
from .models import *


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ["id", "name", "href", "src", "secondsPlayed", "duration", "thumbnail", "color", "date_created", "album"]
        read_only_fields = ["date_created"]


class PlaylistSerializer(serializers.ModelSerializer):
    songs = serializers.PrimaryKeyRelatedField(many=True, queryset=Song.objects.all(), required=False)

    class Meta:
        model = Playlist
        fields = ["id", "name", "songs", "playlist_type", "filters"]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # For filter playlists this looks the songs up from the filters, so it's always current
        rep["songs"] = SongSerializer(instance.get_songs(), many=True).data
        return rep

    def validate_filters(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Filters must be an object.")

        unknown = set(value) - set(DEFAULT_SONG_FILTERS)
        if unknown:
            raise serializers.ValidationError(
                f"Unknown filter(s): {', '.join(sorted(unknown))}. "
                f"Allowed: {', '.join(DEFAULT_SONG_FILTERS)}."
            )

        for key, filter_value in value.items():
            if not isinstance(filter_value, str):
                raise serializers.ValidationError(f"Filter '{key}' must be a string.")

        since = value.get("since")
        if since:
            try:
                valid = parse_date(since) is not None
            except ValueError:
                valid = False
            if not valid:
                raise serializers.ValidationError("Filter 'since' must be a date like 2026-10-11.")

        return value

    def validate(self, attrs):
        current_type = self.instance.playlist_type if self.instance else Playlist.MANUAL
        playlist_type = attrs.get("playlist_type", current_type)

        if self.instance and playlist_type != current_type:
            raise serializers.ValidationError(
                {"playlist_type": "A playlist's type can't be changed after it's created."}
            )

        if playlist_type == Playlist.FILTER:
            if attrs.get("songs"):
                raise serializers.ValidationError(
                    {"songs": "Filter playlists don't hold songs; they're picked by their filters."}
                )
            attrs.pop("songs", None)

            # Always store every filter key, so the frontend can use the dict as-is
            if "filters" in attrs or not self.instance:
                attrs["filters"] = {**DEFAULT_SONG_FILTERS, **attrs.get("filters", {})}
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
