import { useEffect, useRef } from "react";
import * as Song from "./SongFunctions";

export default function SongCard({ song, currentSong, setCurrentSong }) {
  const audioRef = useRef(null);
  const isCurrentSong = currentSong?.id === song.id;

  useEffect(() => {
    if (!isCurrentSong && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isCurrentSong]);

  const handlePlay = () => {
    setCurrentSong(song);
  };

  return (
    <div
      onClick={() => playSong(song, setCurrentSong, isCurrentSong, audioRef)}
      className={`relative flex flex-col border p-5 transition-all duration-200 ${
        isCurrentSong
          ? "border-blue-500 border-2 shadow-lg shadow-blue-200"
          : "border-gray-300"
      }`}
    >
      <button
        onClick={(e) => {e.stopPropagation(); Song.deleteSong(song.id)}}
        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        X
      </button>
      <h3 className="font-bold text-3xl text-center m-5">{song.name}</h3>
      <audio
        controls
        ref={audioRef}
        src={`http://localhost:8000/${song.src}`}
        onPlay={() => setCurrentSong(song)}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function playSong(song, setCurrentSong, isCurrentSong, audioRef) {
  if (isCurrentSong) {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } 
    else {
      audioRef.current.pause();
      setCurrentSong(null);
    }
  } 
  else {
    setCurrentSong(song);
    audioRef.current.play();
  }
}
