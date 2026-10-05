import { useEffect, useRef, useState } from "react";
import * as Song from "./SongFunctions";
import { Edit, Eraser } from "lucide-react";
import { useNotification } from "../layout/notification/NotificationContext";
import { getRandomColor } from "../visual/colors";
import { API_BASE_URL } from "@/app/lib/config";

export default function SongCard({
  song,
  isCurrentSong,
  setCurrentSong,
  onSongEnd,
  onAudioRef,
  setSongToEdit,
}) {
  const BACKGROUND_COLOR_OPACITY = 1;
  const audioRef = useRef(null);
  const notify = useNotification();

  useEffect(() => {
    if (isCurrentSong) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isCurrentSong]);

  if (!song.color.includes(",")) {
    song.color = hexToRgbShort(song.color);
  }

  var background = song.color.split(",");

  var fontColor = getTextColor(background.map(h => parseInt(h)))
  var bgColor1 = `rgba(${[...background, BACKGROUND_COLOR_OPACITY].join(",")})`;
  var bgColor2 = `rgba(${[...background.map((s) => (s -= 25)), BACKGROUND_COLOR_OPACITY].join(",")})`;

  return (
    <div
      className={`rounded-xl p-1.5 transition-all duration-200 hover:scale-105 cursor-pointer ${isCurrentSong ? "bg-red-500" : "bg-black z-0"}`}
    >
      <div
        onClick={() => setCurrentSong(isCurrentSong ? null : song)}
        className={`relative w-full flex flex-col p-1 h-full z-10 rounded-xl justify-between`}
        style={{
          background: `linear-gradient(45deg, ${bgColor1}, ${bgColor2})`,
          color: fontColor
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className="absolute top-1 left-1 text-black w-4 h-4 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
        >
          <Edit onClick={() => setSongToEdit(song)} />
        </button>

        <h3 className="font-bold text-[clamp(0.5rem,4cqw,1rem)] text-center m-5 h-full flex items-center justify-center">
          {song.name}
        </h3>
        <audio
          className="w-full"
          ref={(el) => {
            // this sets the audioRef so that this SongCard gets the html, and also calls onAudioRef so SongsList can get it too. Neat!
            audioRef.current = el;
            if (isCurrentSong) onAudioRef(el);
          }}
          src={`${API_BASE_URL}/${song.src}`}
          crossOrigin="use-credentials"
          preload="auto"
          onPlay={() => setCurrentSong(song)}
          onClick={(e) => e.stopPropagation()}
          onEnded={onSongEnd}
        />
      </div>
    </div>
  );
}

const hexToRgbShort = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : null;
};

function getTextColor(rgb) {
  const THRESHOLD_SUM_ALL = 250
  const THRESHOLD_SUM_TWO = 75

  const LIGHT_COLOR = "white"
  const DARK_COLOR = "black"

  const [r, g, b] = rgb;

  if (r + g + b < THRESHOLD_SUM_ALL) {
    return LIGHT_COLOR
  }

  if (r + g < THRESHOLD_SUM_TWO || r + b < THRESHOLD_SUM_TWO || g + b < THRESHOLD_SUM_TWO) {
    return LIGHT_COLOR
  }

  return DARK_COLOR
}