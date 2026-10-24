
from io import BytesIO
from math import ceil, sqrt

from django.core.files.base import ContentFile
from PIL import Image, ImageOps, UnidentifiedImageError


def generate_playlist_thumbnail(playlist):
    songs = list(playlist.get_songs())

    # An empty playlist has no composite cover.
    if not songs:
        if playlist.thumbnail:
            playlist.thumbnail.delete(save=False)
            type(playlist).objects.filter(pk=playlist.pk).update(
                thumbnail=""
            )
        return

    # 1 song = 1x1, 2-4 songs = 2x2, 5-9 songs = 3x3.
    grid_size = min(ceil(sqrt(len(songs))), 3)
    
    tile_size = 300
    canvas_size = grid_size * tile_size

    canvas = Image.new(
        "RGB",
        (canvas_size, canvas_size),
        color="#222222",
    )

    counted_songs = 0

    for index, song in enumerate(songs):
        if int(counted_songs) >= int(grid_size * grid_size): break

        print(song.thumbnail)

        if not song.thumbnail:
            print("test")
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
        x = (counted_songs % grid_size) * tile_size
        y = (counted_songs // grid_size) * tile_size

        print(f"{x} {y}")

        canvas.paste(image, (x, y))

        counted_songs += 1



    # Encode the composite as a JPEG in memory.
    output = BytesIO()
    canvas.save(output, format="JPEG", quality=90)
    output.seek(0)

    # Replace the previous generated thumbnail.
    if playlist.thumbnail:
        playlist.thumbnail.delete(save=False)

    filename = f"playlist_{playlist.pk}_${playlist.name}.jpg"

    playlist.thumbnail.save(
        filename,
        ContentFile(output.getvalue()),
        save=False,
    )

    # Avoid calling playlist.save(), which would trigger signals again.
    type(playlist).objects.filter(pk=playlist.pk).update(
        thumbnail=playlist.thumbnail.name
    )
