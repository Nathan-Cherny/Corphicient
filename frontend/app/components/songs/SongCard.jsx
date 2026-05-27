"use client";

import * as Song from "./Song";

export default function SongCard({ song }) {
  return (
    <div className="relative flex flex-col border p-5">
      <button onClick={() => Song.deleteSong(song.id)} className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center hover:scale-110 hover:cursor-pointer transition-all duration-200">
        X
      </button>
      <h3 className="font-bold text-3xl text-center m-5">{song.name}</h3>
      <audio controls src={`http://localhost:8000/${song.href}`} />
    </div>
  );
}
