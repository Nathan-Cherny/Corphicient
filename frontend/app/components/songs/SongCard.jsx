import { useEffect, useRef } from "react";
import * as Song from "./SongFunctions";

export default function SongCard({
  song,
  isCurrentSong,
  setCurrentSong,
  onSongEnd,
  onAudioRef
}) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (isCurrentSong) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isCurrentSong]);

  return (
    <div
      onClick={() => setCurrentSong(isCurrentSong ? null : song)}
      className={`relative flex flex-col border p-5 transition-all duration-200 ${
        isCurrentSong
          ? "border-blue-500 border-2 shadow-lg shadow-blue-200"
          : "border-gray-300"
      }
      hover:scale-105 hover:cursor-pointer`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          Song.deleteSong(song.id);
        }}
        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        X
      </button>
      <h3 className="font-bold text-3xl text-center m-5">{song.name}</h3>
      <audio
        controls
        ref={(el) => {
          // this sets the audioRef so that this SongCard gets the html, and also calls onAudioRef so SongsList can get it too. Neat!
          audioRef.current = el;
          if (isCurrentSong) onAudioRef(el);
        }}
        src={`http://localhost:8000/${song.src}`}
        onPlay={() => setCurrentSong(song)}
        onClick={(e) => e.stopPropagation()}
        onLoadedMetadata={() => console.log(`${song.name} is ready`)}
        onEnded={onSongEnd}
      />
    </div>
  );
}
