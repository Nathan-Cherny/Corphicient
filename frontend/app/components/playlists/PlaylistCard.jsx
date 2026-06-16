"use client";

import * as Playlist from "./PlaylistFunctions";
import SongsList from "../songs/SongsList";
import { Edit, Eraser } from "lucide-react";
import EditPlaylist from "./EditPlaylist";

import { useState, useEffect, useRef } from "react";
import PieChartVis from "../visual/PieChart";
import { getRandomColor } from "../visual/colors";
import FadeOverlay from "../layout/FadeOverlay";
import { PieChart } from "lucide-react";

export default function PlaylistCard({
  playlist,
  currentSong,
  setCurrentSong,
  settings
}) {
  const [showEdit, setShowEdit] = useState(false);
  const [songsListHeight, setSongsListHeight] = useState(null);
  const songsListRef = useRef(null);
  const [pieChartOpen, setPieChartOpen] = useState(false)

  useEffect(() => {
    if (!songsListRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setSongsListHeight(entry.contentRect.height);
    });
    observer.observe(songsListRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative flex flex-col border p-5">
      <button
        onClick={() => Playlist.deletePlaylist(playlist.id)}
        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        X
      </button>
      <button
        onClick={() => setShowEdit((prev) => !prev)}
        className="absolute top-2 text-black w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        <Edit />
      </button>

      <div className="flex flex-row gap-5">
        {showEdit && (
          <EditPlaylist
            maxHeight={songsListHeight}
            onSave={async (selected) => {
              await Playlist.putPlaylist(playlist.id, selected, playlist.name);
            }}
            playlistSongs={playlist.songs}
          />
        )}

        <div>
          <h3
            className={`font-bold text-3xl text-center m-5 
              ${playlist.name == "Hall Of Fame" ? "bg-[#FFD700] bg-clip-text text-transparent font-extrabold text-shadow-black" : ""}`}
          >
            {playlist.name}
          </h3>
          <p className="w-full">
            Total Duration: <i>{getTotalDuration(playlist.songs)}</i>
          </p>
          <div className="w-full flex flex-row gap-5">
            <p>Total Time Spent Listening to Songs: <i>{getTotalPlayed(playlist.songs)}</i></p>
            <PieChart className="cursor-pointer hover:scale-105" onClick={() => setPieChartOpen(true)}/>
          </div>

          <FadeOverlay isOpen={pieChartOpen} onClose={() => setPieChartOpen(false)}>
            <PieChartVis data={playlist.songs.map(s => ({name: s.name, secondsPlayed: s.secondsPlayed, fill: getRandomColor()}))} playlistName={playlist.name}/>
          </FadeOverlay>


          <hr className="w-full border my-15" />

          <div className="flex flex-row" style={{ alignItems: "start" }}>
            <div ref={songsListRef}>
              <SongsList
                currentSong={currentSong}
                setCurrentSong={setCurrentSong}
                songs={playlist.songs}
                settings={settings}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTotalDuration(songs) {
  let totalSeconds = songs
    .map((song) => song.duration)
    .reduce((acc, current) => acc + current, 0);
  return getReadableDurationSong(totalSeconds);
}

function getTotalPlayed(songs) {
  let totalSeconds = songs
    .map((song) => song.secondsPlayed)
    .reduce((acc, current) => acc + current, 0);
  return getReadableDurationSong(totalSeconds);
}

export function getReadableDurationSong(totalSeconds, format = "full") {
  const { hours = 0, minutes = 0, seconds = 0 } = convertSeconds(totalSeconds);

  if (format === "small") {
    const pad = (n) => n.toString().padStart(2, "0");
    return hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`;
  }

  const parts = [];
  if (hours) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

  return parts.join(", ");
}

// this looks familar...
function convertSeconds(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = Math.floor(totalSeconds % 60);

  return { hours, minutes, seconds };
}
