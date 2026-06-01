"use client";

// imports from next
import SongCard from "./SongCard";

import { useState } from "react";

export default function SongsList({songs, currentSong, setCurrentSong}) {
  const request = ["songs/", null, "", "GET"]

  return (
    <div className="flex flex-wrap justify-center m-20 gap-7">
      {songs.map((song, i) => (
        <div key={i}>
          <SongCard song={song} currentSong={currentSong} setCurrentSong={setCurrentSong}/>
        </div>
        
      ))}
    </div>
  );
}
