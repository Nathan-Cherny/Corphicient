"use client";

// imports from next
import SongCard from "./SongCard";

export default function SongsList({songs}) {
  const request = ["songs/", null, "", "GET"]

  return (
    <div className="flex flex-wrap justify-center m-20 gap-7">
      {songs.map((song, i) => (
        <div key={i}>
          <SongCard song={song}/>
        </div>
        
      ))}
    </div>
  );
}
