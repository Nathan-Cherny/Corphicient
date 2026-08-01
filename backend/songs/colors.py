import colorthief

def get_song_color(img):

    color_thief = colorthief.ColorThief(img)
    color = color_thief.get_color(quality=1)
    color = ",".join(map(str, color))

    return f"{color}"
