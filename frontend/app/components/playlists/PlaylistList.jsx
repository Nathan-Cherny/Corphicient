"use client";

// imports from next
import axiosClient from "../../axiosClient";
import { act, useEffect, useState } from "react";
import PlaylistCard from "./PlaylistCard";

export default function PlaylistList({}) {
  const request = ["playlists/", null, "", "GET"];

  const [activePlaylist, setActivePlaylist] = useState(null)
  const [playlists, setPlaylists] = useState([]);
  const [currentSong, setCurrentSong] = useState(null)

  useEffect(() => {
    async function allPlaylists() {
      const res = await axiosClient(...request);
      setPlaylists(res || []);
    }

    allPlaylists();
  }, [request[0]]);

  useEffect(() => {
    document.title = currentSong ? `${currentSong.name} | ${activePlaylist.name} | Corphicient` : "Corphicient"
  }, [currentSong]);

  return (
    <div className="flex flex-col flex-wrap justify-center m-20 gap-7">
      <div id="playlistButtonBar" className="flex flex-row gap-10 justify-center">
        {playlists.map((pl, i) => (
          <button onClick={() => changePlaylist(pl.id, playlists, setCurrentSong, activePlaylist, setActivePlaylist)} key={i} id={pl.id} className="border bg-blue-50 p-5 hover:scale-105 hover:cursor-pointer">{pl.name}</button>
      ))}
      </div>

      {activePlaylist && (
        <PlaylistCard playlist={activePlaylist} currentSong={currentSong} setCurrentSong={setCurrentSong} />
      )}
    </div>
  );
}

function findPlaylist(id, playlists){
  return playlists.find(pl => pl.id === id)
}

function changePlaylist(id, playlists, setCurrentSong, activePlaylist, setActivePlaylist){
  if(activePlaylist && id == activePlaylist.id){return}
  setCurrentSong(null)
  setActivePlaylist(findPlaylist(id, playlists))
}