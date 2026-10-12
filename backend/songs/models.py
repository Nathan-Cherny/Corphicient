from django.db import models

from .filters import filter_songs

class Song(models.Model):
    name = models.CharField(max_length=50)
    href = models.CharField(max_length=250)

    src = models.CharField(max_length=100, blank=True)
    secondsPlayed = models.FloatField(blank=True, default=0)
    duration = models.FloatField(blank=True, default=0)

    thumbnail = models.ImageField(upload_to='thumbnail/', blank=True, null=True)
    color = models.CharField(max_length=15, default="#44BBBB")

    album = models.CharField(max_length=50, default="")

    tags = models.JSONField(default=list)

    date_created = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name


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

    # A filter playlist ("FilterPlaylist") holds no songs. It stores filters instead (see
    # songs/filters.py for what they can be) and looks its songs up every time, so new songs
    # show up in it automatically. Only the filters that are switched on are stored.
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
