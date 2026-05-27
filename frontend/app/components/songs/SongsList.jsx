"use client";

// imports from next
import axiosClient from "../../axiosClient";
import { useEffect, useState } from "react";
import SongCard from "./SongCard";

// request example: ["foodtrucks/", null, "", "GET"]
export default function SongsList({ request }) {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    async function allSongs() {
      const res = await axiosClient(...request);
      console.log(res);
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
