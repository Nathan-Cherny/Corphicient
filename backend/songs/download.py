import yt_dlp
from mutagen.mp3 import MP3


def download_song(url, name="New Song", output_dir="../backend/media/songs/"):
    downloaded_path = {"filename": None}

    def progress_hook(d):
        if d["status"] == "downloading":
            downloaded = d.get("downloaded_bytes", 0)
            total = d.get("total_bytes") or d.get("total_bytes_estimate")

            if total:
                progress = downloaded / total * 100
                send_progress_to_frontend(progress)

    def postprocessor_hook(d):
        if d["status"] == "finished":
            downloaded_path["filename"] = d["info_dict"]["filepath"]

    ydl_opts = {
        "format": "bestaudio/best",
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
            }
        ],
        "outtmpl": f"{output_dir}/{name}.%(ext)s",
        "progress_hooks": [progress_hook],
        "postprocessor_hooks": [postprocessor_hook],
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)

            sanitized_info = ydl.sanitize_info(info)

            location = convertPathToLocalSRC(downloaded_path.get("filename"))
            audio = MP3(location)
            duration = audio.info.length

            return {"location": location, "duration": duration}
    except Exception as e:
        print(f"\n\n\nException while downloading song: \n\n{e}")
        return {"location": "", "duration": 0}


def convertPathToLocalSRC(path):
    return "/".join(path.split("\\")[2:])

def send_progress_to_frontend(progress):
    print(progress)
