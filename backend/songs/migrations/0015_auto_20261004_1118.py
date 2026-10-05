from django.db import migrations
import os
from datetime import datetime
from django.utils import timezone


def populate_date_created(apps, schema_editor):
    Song = apps.get_model("songs", "Song")

    for song in Song.objects.all():
        if not song.src:
            continue

        file_path = os.path.join(
            r"C:\Users\comsc\Desktop\Personal Projects\Corphicient\backend\media",
            song.src,
        )

        if not os.path.exists(file_path):
            continue

        created_timestamp = os.path.getctime(file_path)

        date_created = datetime.fromtimestamp(
            created_timestamp, tz=timezone.get_current_timezone()
        )

        song.date_created = date_created
        song.save(update_fields=["date_created"])


def reverse_date_created(apps, schema_editor):
    Song = apps.get_model("songs", "Song")
    Song.objects.all().update(date_created=None)


class Migration(migrations.Migration):

    dependencies = [
        ("songs", "0014_song_date_created"),
    ]

    operations = [
        migrations.RunPython(
            populate_date_created,
            reverse_date_created,
        ),
    ]
