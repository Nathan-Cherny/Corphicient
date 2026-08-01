import colorthief

def get_song_color(img):
    print(img)
    color_thief = colorthief.ColorThief(img)
    return f"rgb{color_thief.get_color(quality=1)}"
