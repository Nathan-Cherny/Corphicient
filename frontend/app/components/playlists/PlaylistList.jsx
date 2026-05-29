"use client";

// imports from next
import axiosClient from "../../axiosClient";
import { useEffect, useState } from "react";
import PlaylistCard from "./PlaylistCard";

export default function PlaylistList({}) {
  const request = ["playlists/", null, "", "GET"];
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    async function allPlaylists() {
      const res = await axiosClient(...request);
      setPlaylists(res || []);
    }

    allPlaylists();
  }, [request[0]]);

  return (
    <div className="flex flex-wrap justify-center m-20 gap-7">
      {playlists.map((pl, i) => (
        <div key={i}>
          <PlaylistCard playlist={pl} />
        </div>
      ))}
    </div>
  );
}
