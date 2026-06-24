from pydub import AudioSegment

# Define the start and end times in milliseconds (1 second = 1000 milliseconds)
start_time = 10 * 1000  # 10 seconds
end_time = 30 * 1000    # 30 seconds


def cropSong(src, cropParams, name):
    start_time = int(cropParams[0]) * 1000
    end_time = int(cropParams[1]) * 1000
    # 1. Load the audio file
    song = AudioSegment.from_file(src, format="mp3")

    # 2. Crop the audio using list slicing
    cropped_song = song[start_time:end_time]

    # 3. Export the cropped segment
    cropped_song.export(src, format="mp3")

    print("Audio successfully cropped!")