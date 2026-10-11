import datetime

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.dateparse import parse_date

class Song(models.Model):
    name = models.CharField(max_length=50)
    href = models.CharField(max_length=250)

    src = models.CharField(max_length=100, blank=True)
    secondsPlayed = models.FloatField(blank=True, default=0)
    duration = models.FloatField(blank=True, default=0)

    thumbnail = models.ImageField(upload_to='thumbnail/', blank=True, null=True)
    color = models.CharField(max_length=15, default="#44BBBB")

    album = models.CharField(max_length=50, default="")

    date_created = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name


# The filters a FilterPlaylist can have. These mirror the song filters in the frontend
# (DEFAULT_FILTERS / filterSongs in frontend/app/components/songs/SongFilter.jsx), so when a
# filter is added there, add it here too.
DEFAULT_SONG_FILTERS = {"name": "", "album": "All", "since": ""}


def filter_songs(queryset, filters):
    """Narrows a Song queryset by a filters dict like {"name": "", "album": "Graduation", "since": ""}.

    Missing keys fall back to DEFAULT_SONG_FILTERS, which means "don't filter on this".
    """
    filters = {**DEFAULT_SONG_FILTERS, **(filters or {})}

    name = filters["name"].strip()
    if name:
        queryset = queryset.filter(name__icontains=name)

    if filters["album"] != "All":
        queryset = queryset.filter(album=filters["album"])

    since = parse_date(filters["since"]) if filters["since"] else None
    if since:
        start = datetime.datetime.combine(since, datetime.time.min)
        if settings.USE_TZ:
            start = timezone.make_aware(start)
        queryset = queryset.filter(date_created__gte=start)

    return queryset


class Playlist(models.Model):
    MANUAL = "manual"
    FILTER = "filter"
    PLAYLIST_TYPES = [
        (MANUAL, "Manual"),
        (FILTER, "Filter"),
    ]

    name = models.CharField(max_length=100)

    # Manual playlists: the songs someone picked. Always empty for filter playlists.
    songs = models.ManyToManyField(Song, blank=True)

    # A filter playlist ("FilterPlaylist") holds no songs. It stores filters instead and
    # looks its songs up every time, so new songs show up in it automatically.
    playlist_type = models.CharField(max_length=10, choices=PLAYLIST_TYPES, default=MANUAL)
    filters = models.JSONField(blank=True, default=dict)

    @property
    def is_filter_playlist(self):
        return self.playlist_type == self.FILTER

    def get_songs(self):
        """The songs this playlist currently contains, whichever type it is."""
        if self.is_filter_playlist:
            return filter_songs(Song.objects.all(), self.filters)
        return self.songs.all()

    def __str__(self):
        return self.name
