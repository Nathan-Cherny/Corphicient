"use client";

// imports from next
import axiosClient from "../../axiosClient";
import { useEffect, useState } from "react";
import SongCard from "./SongCard";

export default function SongsList({filterSongIds}) {
  const request = ["songs/", null, "", "GET"]
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    async function allSongs() {
      let res = await axiosClient(...request);
      if(filterSongIds){
        res = res.filter((song) => filterSongIds.includes(song.id))
      }
      setSongs(res || []);
    }

    allSongs();
  }, [request[0]]);

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
