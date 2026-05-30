"use client";

// imports from next
import axiosClient from "../../axiosClient";
import { act, useEffect, useState } from "react";
import PlaylistCard from "./PlaylistCard";

export default function PlaylistList({}) {
  const request = ["playlists/", null, "", "GET"];

  const [activePlaylist, setActivePlaylist] = useState(null)
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    async function allPlaylists() {
      const res = await axiosClient(...request);
      setPlaylists(res || []);
    }

    allPlaylists();
  }, [request[0]]);

  return (
    <div className="flex flex-col flex-wrap justify-center m-20 gap-7">
      <div id="playlistButtonBar" className="flex flex-row gap-10 justify-center">
        {playlists.map((pl, i) => (
          <button onClick={() => setActivePlaylist(pl.id)} key={i} id={pl.id} className="border bg-blue-50 p-5 hover:scale-105 hover:cursor-pointer">{pl.name}</button>
      ))}
      </div>

      {activePlaylist && (
        <PlaylistCard playlist={playlists.find(pl => pl.id === activePlaylist)} />
      )}
    </div>
  );
}