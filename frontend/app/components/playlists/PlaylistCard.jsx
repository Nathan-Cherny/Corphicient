"use client";

import * as Playlist from "./PlaylistFunctions";
import SongsList from "../songs/SongsList";

import { useState, useEffect } from "react";

export default function PlaylistCard({ playlist, currentSong, setCurrentSong }) {

  return (
    <div className="relative flex flex-col border p-5">
      <button onClick={() => Playlist.deletePlaylist(playlist.id)} className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200">
        X
      </button>
      <h3 className="font-bold text-3xl text-center m-5">{playlist.name}</h3>
      <SongsList currentSong={currentSong} setCurrentSong={setCurrentSong} songs={playlist.songs}/>
    </div>
  );
}
