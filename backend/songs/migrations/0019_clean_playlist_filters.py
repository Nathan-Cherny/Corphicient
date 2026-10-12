from django.db import migrations


def clean_playlist_filters(apps, schema_editor):
    """Filter playlists used to store every filter, with blanks and "All" for the ones that were
    off. Only the filters that are on are stored now (see songs/filters.py), so drop the rest."""
    Playlist = apps.get_model("songs", "Playlist")

    for playlist in Playlist.objects.filter(playlist_type="filter"):
        old = playlist.filters or {}
        new = {
            key: value
            for key, value in old.items()
            if value not in ("", None, [])
            and not (key == "album" and value == "All")  # "All" was the old "no album filter"
        }

        if new != old:
            playlist.filters = new
            playlist.save(update_fields=["filters"])


class Migration(migrations.Migration):

    dependencies = [
        ("songs", "0018_playlist_type_filters"),
    ]

    operations = [
        # nothing to undo: the old format only ever added the blank entries back
        migrations.RunPython(clean_playlist_filters, migrations.RunPython.noop),
    ]
