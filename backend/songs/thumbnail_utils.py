
from io import BytesIO
from math import ceil, sqrt

from django.core.files.base import ContentFile
from PIL import Image, ImageOps, UnidentifiedImageError


def generate_playlist_thumbnail(playlist):
    songs = list(playlist.get_songs()[:9])

    # An empty playlist has no composite cover.
    if not songs:
        if playlist.thumbnail:
            playlist.thumbnail.delete(save=False)
            type(playlist).objects.filter(pk=playlist.pk).update(
                thumbnail=""
            )
        return

    # 1 song = 1x1, 2-4 songs = 2x2, 5-9 songs = 3x3.
    grid_size = ceil(sqrt(len(songs)))
    tile_size = 300
    canvas_size = grid_size * tile_size

    canvas = Image.new(
        "RGB",
        (canvas_size, canvas_size),
        color="#222222",
    )

    for index, song in enumerate(songs):
        if not song.thumbnail:
            continue

        try:
            with song.thumbnail.open("rb") as file:
                with Image.open(file) as image:
                    image = image.convert("RGB")
                    image = ImageOps.fit(
                        image,
                        (tile_size, tile_size),
                    )
                    image.load()
        except (OSError, ValueError, UnidentifiedImageError):
            continue

        # Position each image in row-major order.
        x = (index % grid_size) * tile_size
        y = (index // grid_size) * tile_size

        canvas.paste(image, (x, y))

    # Encode the composite as a JPEG in memory.
    output = BytesIO()
    canvas.save(output, format="JPEG", quality=90)
    output.seek(0)

    # Replace the previous generated thumbnail.
    if playlist.thumbnail:
        playlist.thumbnail.delete(save=False)

    filename = f"playlist_{playlist.pk}.jpg"

    playlist.thumbnail.save(
        filename,
        ContentFile(output.getvalue()),
        save=False,
    )

    # Avoid calling playlist.save(), which would trigger signals again.
    type(playlist).objects.filter(pk=playlist.pk).update(
        thumbnail=playlist.thumbnail.name
    )
