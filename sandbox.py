from backend import songs
import yt_dlp

a = [
    {"name": "Feeling Good", 'src': "https://www.youtube.com/watch?v=MBWK0WEkdEo"},
    {"name": "Vega Theme", "src": "https://downloads.khinsider.com/game-soundtracks/album/super-smash-bros.-ultimate-enhanced-original-soundtrack/5-16%2520-%2520Vega%2520Stage%2520%255BStreet%2520Fighter%2520II%255D.mp3"},
    {"name": "Spunky", "src": "https://downloads.khinsider.com/game-soundtracks/album/street-fighter-iii-3rd-strike-original-soundtrack/1-07.%2520Makoto%2520Stage%2520-SPUNKY-.mp3"},
    {"name": "Wizard City", "src": "https://www.youtube.com/watch?v=8zWp25WaN1Y"},
    {"name": "Krokotopia", "src": "https://www.youtube.com/watch?v=HB-Q1v1Npds"},
    {"name": "Route 29", "src": "https://downloads.khinsider.com/game-soundtracks/album/pokemon-heartgold-and-soulsilver-music-super-complete/1-09.%2520Route%252029.mp3"},
    {"name": "New Bark Town", "src": "https://downloads.khinsider.com/game-soundtracks/album/pokemon-heartgold-and-soulsilver-music-super-complete/1-04.%2520New%2520Bark%2520Town.mp3"}
]


def download_song(url, name="New Song", output_dir="../backend/media/songs/"):
    downloaded_path = {}

    def postprocessor_hook(d):
        if d["status"] == "finished":
            downloaded_path["filename"] = d["info_dict"]["filepath"]

    ydl_opts = {
        "format": "bestaudio[ext=mp3]/bestaudio",
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
        }],
        "outtmpl": f"{output_dir}/{name}.%(ext)s",
        "postprocessor_hooks": [postprocessor_hook],
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            sanitized_info = ydl.sanitize_info(info)
            return {
                "location": convertPathToLocalSRC(downloaded_path.get("filename")),
                "duration": sanitized_info.get('duration')
            }
    except Exception as e:
        print(f"\n\n\nException while downloading song: \n\n{e}")
        return {
            "location": "",
            "duration": 0
        }

def convertPathToLocalSRC(path):
    return "/".join(path.split("\\")[2:])

for link in a:
    download_song(link["src"], link["name"])
