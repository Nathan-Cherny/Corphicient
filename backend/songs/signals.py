
from django.db.models.signals import (
    post_delete,
    post_save,
    m2m_changed,
)
from django.dispatch import receiver

from .models import Playlist, Song
from .thumbnail_utils import generate_playlist_thumbnail


def refresh_song_playlists(song):
    # Manual playlists containing this song.
    playlists = Playlist.objects.filter(
        playlist_type=Playlist.MANUAL,
        songs=song,
    )

    for playlist in playlists:
        generate_playlist_thumbnail(playlist)

    # Filter playlists may include this song even though they have
    # no explicit many-to-many relationship with it.
    filter_playlists = Playlist.objects.filter(
        playlist_type=Playlist.FILTER,
    )

    for playlist in filter_playlists:
        generate_playlist_thumbnail(playlist)


@receiver(post_save, sender=Song)
def song_saved(sender, instance, **kwargs):
    refresh_song_playlists(instance)


@receiver(post_delete, sender=Song)
def song_deleted(sender, instance, **kwargs):
    refresh_song_playlists(instance)


@receiver(m2m_changed, sender=Playlist.songs.through)
def playlist_songs_changed(
    sender, instance, action, reverse, pk_set, **kwargs
):
    if action not in ("post_add", "post_remove", "post_clear"):
        return

    if reverse:
        # A Song was added to or removed from its playlists.
        if action == "post_clear":
            refresh_song_playlists(instance)
        else:
            for playlist in Playlist.objects.filter(pk__in=pk_set):
                generate_playlist_thumbnail(playlist)
    else:
        # A Playlist's song membership changed.
        generate_playlist_thumbnail(instance)


@receiver(post_save, sender=Playlist)
def playlist_saved(sender, instance, **kwargs):
    # Regenerate a filter playlist when its filters or type are saved.
    # Manual playlist membership is handled by m2m_changed.
    if instance.is_filter_playlist:
        generate_playlist_thumbnail(instance)
