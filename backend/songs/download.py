import yt_dlp

def download_song(url, name="New Song", output_dir="../backend/media/songs/"):
    type = "mp3"
    downloaded_path = {}

    def progress_hook(d):
        if d["status"] == "finished":
            downloaded_path["filename"] = d["filename"]

    ydl_opts = {
        "format": "bestaudio[ext=mp3]/bestaudio",
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
        }],
        "outtmpl": f"{output_dir}/{name}.mp3",
        "progress_hooks": [progress_hook],
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
            return convertPathToLocalSRC(downloaded_path.get("filename"))
    except:
        return ""
    
def convertPathToLocalSRC(path):
    return "/".join(path.split("\\")[2:])