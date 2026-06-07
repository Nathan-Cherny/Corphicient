"use client"

import { useState, useEffect } from "react";
import axiosClient from "@/app/axiosClient";

export default function EditPlaylist({ playlistSongs }) {
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]) 

  useEffect(() => {
    async function getSongs() {
      const res = await axiosClient("/songs", null, null, "GET");

      const songIds = playlistSongs.map((song) => song.id);

      const updatedSongs = res.map((song) => ({
        ...song,
        includes: songIds.includes(song.id),
      }));

      setSongs(updatedSongs);
      setSelectedSongs(playlistSongs.map((song) => song.name))
    }

    getSongs();
    console.log(selectedSongs)
  }, [playlistSongs]);

  return (
    <select defaultValues={selectedSongs} multiple>
      {songs.map((song) => (
        <option
          key={song.id}
          value={song.id}
        >
          {song.name}
        </option>
      ))}
    </select>
  );
}
