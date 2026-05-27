import yt_dlp

def download_m4a(url, output_dir="../backend/media/songs/"):
    ydl_opts = {
        "format": "bestaudio[ext=m4a]/bestaudio",
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "m4a",
        }],
        "outtmpl": f"{output_dir}/%(title)s.%(ext)s",
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            results = ydl.download([url])
            print(results)
            return results
    except:
        pass

