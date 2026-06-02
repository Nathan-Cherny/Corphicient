import yt_dlp

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
                "duration": sanitized_info.get('duration') or 0
            }
    except Exception as e:
        print(f"\n\n\nException while downloading song: \n\n{e}")
        return {
            "location": "",
            "duration": 0
        }


def convertPathToLocalSRC(path):
    return "/".join(path.split("\\")[2:])