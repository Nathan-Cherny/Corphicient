"use client";

import * as Playlist from "./PlaylistFunctions";
import SongsList from "../songs/SongsList";
import { Edit, Eraser } from "lucide-react";
import EditPlaylist from "./EditPlaylist";

import { useState, useEffect } from "react";

export default function PlaylistCard({
  playlist,
  currentSong,
  setCurrentSong,
}) {
  return (
    <div className="relative flex flex-col border p-5">
      <EditPlaylist
        onSave={async (selected) => {
          const res = await Playlist.putPlaylist(
            playlist.id,
            selected,
            playlist.name,
          );
          console.log(res);
        }}
        playlistSongs={playlist.songs}
      />
      <button
        onClick={() => Playlist.deletePlaylist(playlist.id)}
        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200"
      >
        X
      </button>
      <button className="absolute top-2 text-black w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200">
        <Edit />
      </button>
      <h3 className="font-bold text-3xl text-center m-5">{playlist.name}</h3>
      <SongsList
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        songs={playlist.songs}
      />
    </div>
  );
}
