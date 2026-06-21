import { useEffect, useRef, useState } from "react";
import * as Song from "./SongFunctions";
import { Edit, Eraser } from "lucide-react";
import FadeOverlay from "../layout/FadeOverlay";
import { useNotification } from "../layout/notification/NotificationContext";
import EditSong from "./EditSong";

export default function SongCard({
  song,
  isCurrentSong,
  setCurrentSong,
  onSongEnd,
  onAudioRef,
}) {
  const audioRef = useRef(null);
  const notify = useNotification();
  const [showEdit, setShowEdit] = useState(false);

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
      style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
      className={`relative w-1/4 flex flex-col border transition-all duration-200 justify-between ${
        isCurrentSong
          ? "border-blue-500 border-4 shadow-lg shadow-blue-200"
          : "border-gray-300 border-2"
      }
      hover:scale-105 hover:cursor-pointer`}
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
        <Edit onClick={() => setShowEdit((prev) => !prev)} />
      </button>

      <FadeOverlay isOpen={showEdit} onClose={() => setShowEdit(false)}>
        <EditSong />
      </FadeOverlay>

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
