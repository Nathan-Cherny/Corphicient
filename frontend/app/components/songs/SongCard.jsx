import { useEffect, useRef, useState } from "react";
import * as Song from "./SongFunctions";
import { Edit, Eraser } from "lucide-react";
import { useNotification } from "../layout/notification/NotificationContext";
import { getRandomColor } from "../visual/colors";

export default function SongCard({
  song,
  isCurrentSong,
  setCurrentSong,
  onSongEnd,
  onAudioRef,
  setSongToEdit
}) {
  const audioRef = useRef(null);
  const notify = useNotification();
  const [color1, setColor] = useState(getRandomColor({a:0.25}))
  const [color2, setColor2] = useState(getRandomColor({a:0.25}))

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
      className={`relative w-full flex flex-col p-1 border shadow-[5px_5px_2px_0px_rgba(0,0,0,1)] transition-all duration-200 justify-between ${
        isCurrentSong
        ? "border-blue-500 border-4"
        : ""
        }
        hover:scale-105 hover:cursor-pointer`}
        style={{ background: `linear-gradient(263deg, ${color1}, ${color2}`}}
    >
      {/* <button
        onClick={(e) => {
          e.stopPropagation();
          Song.deleteSong(song.id);
        }}
        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        X
      </button> */}

      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className="absolute top-1 left-1 text-black w-4 h-4 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        <Edit onClick={() => setSongToEdit(song)} />
      </button>

      <h3 className="font-bold text-3xl text-center m-5 h-full flex items-center justify-center">
        {song.name}
      </h3>
      <audio
        className="w-full"
        ref={(el) => {
          // this sets the audioRef so that this SongCard gets the html, and also calls onAudioRef so SongsList can get it too. Neat!
          audioRef.current = el;
          if (isCurrentSong) onAudioRef(el);
        }}
        src={`http://localhost:8000/${song.src}`}
        crossOrigin="use-credentials"
        preload="auto"
        onPlay={() => setCurrentSong(song)}
        onClick={(e) => e.stopPropagation()}
        onEnded={onSongEnd}
      />
    </div>
  );
}
