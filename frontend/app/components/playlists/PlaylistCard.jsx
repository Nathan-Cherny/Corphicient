"use client";

import * as Playlist from "./PlaylistFunctions";
import SongsList from "../songs/SongsList";
import { Edit, Eraser } from "lucide-react";
import EditPlaylist from "./EditPlaylist";

import { useState, useEffect, useRef } from "react";

export default function PlaylistCard({
  playlist,
  currentSong,
  setCurrentSong,
}) {
  const [showEdit, setShowEdit] = useState(false);
  const [songsListHeight, setSongsListHeight] = useState(null);
  const songsListRef = useRef(null);

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
      <h3 className="font-bold text-3xl text-center m-5">{playlist.name}</h3>
      <p className="w-full">
        Total Duration: <i>{getTotalDuration(playlist.songs)}</i>
      </p>
      <div
        className="flex flex-row"
        style={{ marginTop: "5%", alignItems: "start" }}
      >
        {showEdit && (
          <EditPlaylist
            maxHeight={songsListHeight}
            onSave={async (selected) => {
              await Playlist.putPlaylist(playlist.id, selected, playlist.name);
            }}
            playlistSongs={playlist.songs}
          />
        )}
        <div ref={songsListRef}>
          <SongsList
            currentSong={currentSong}
            setCurrentSong={setCurrentSong}
            songs={playlist.songs}
          />
        </div>
      </div>
    </div>
  );
}

function getTotalDuration(songs) {
  let totalSeconds = songs
    .map((song) => song.duration)
    .reduce((acc, current) => acc + current, 0);
  let timeData = convertSeconds(totalSeconds);
  return `${timeData["hours"]} hours, ${timeData["minutes"]} minutes, ${timeData["seconds"]} seconds`;
}

// this looks familar...
function convertSeconds(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = Math.floor(totalSeconds % 60);

  return { hours, minutes, seconds };
}
