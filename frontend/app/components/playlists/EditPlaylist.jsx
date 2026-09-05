// EditPlaylist.jsx
"use client";

import { useState, useEffect } from "react";
import { useNotification } from "../layout/notification/NotificationContext";
import axiosClient from "@/app/axiosClient";
import SongSelect from "../songs/SongSelect";

export default function EditPlaylist({ playlist, onSave }) {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(0);
  const notify = useNotification();

  const playlistSongs = playlist.songs;
  const playlistName = playlist.name;

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [inputName, setInputName] = useState(playlistName);

  useEffect(() => {
    async function getSongs() {
      setLoading(true);
      const res = await axiosClient("/songs", null, null, "GET");
      setSongs(res);
      setSelectedIds(new Set(playlistSongs.map((s) => s.id)));
      setLoading(false);
    }
    getSongs();
  }, [playlistSongs, change]);

  function toggle(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleSave() {
    onSave?.(Array.from(selectedIds), inputName);
    notify({ message: "Edited Playlist!" });
    setChange((c) => c + 1);
  }

  if (loading) return <p className="text-sm text-muted">Loading songs…</p>;

  return (
    <div
      className="flex flex-col gap-3 bg-white p-5"
      style={{
        minWidth: "150px",
        minHeight: "300px",
        textWrap: "wrap",
        width: "fit",
        overflowY: "auto",
        maxHeight: "650px",
      }}
    >
      <div className="flex flex-row">
        <h1 className="text-2xl text-center">Edit <b>{playlistName}</b></h1>

      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">
          <strong>{selectedIds.size}</strong> in playlist
        </span>
        <button
          onClick={handleSave}
          className="btn-primary bg-red-200 p-2"
          style={{ cursor: "pointer" }}
        >
          Save changes
        </button>
      </div>

      <div>
        <div className="flex flex-row gap-5 my-5 items-center">
          <label htmlFor="name">Change Name</label>
          <input className="border-gray-500 border p-0.5" name="name" type="text" onChange={(e) => setInputName(e.target.value)} value={inputName}/>
        </div>
        <SongSelect
          songs={songs}
          selectedIds={selectedIds}
          onToggle={toggle}
          search={search}
          onSearchChange={setSearch}
        />
      </div>
    </div>
  );
}
