// EditPlaylist.jsx
"use client"

import { useState, useEffect } from "react";
import { useNotification } from "../layout/notification/NotificationContext";
import axiosClient from "@/app/axiosClient";
import SongSelect from "../songs/SongSelect";

export default function EditPlaylist({ playlistSongs, onSave, maxHeight }) {
  const [songs, setSongs] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(0);
  const notify = useNotification();

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
    onSave?.(Array.from(selectedIds));
    notify({ message: "Edited Playlist!" });
    setChange((c) => c + 1);
  }

  if (loading) return <p className="text-sm text-muted">Loading songs…</p>;

  return (
    <div
      className="flex flex-col gap-3"
      style={{ minWidth: "150px", minHeight: "300px", textWrap: "wrap", width: "fit", overflowY: "auto", maxHeight: maxHeight ?? "100%" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm">
          <strong>{selectedIds.size}</strong> in playlist
        </span>
        <button onClick={handleSave} className="btn-primary bg-red-200 p-2" style={{ cursor: "pointer" }}>
          Save changes
        </button>
      </div>

      <SongSelect
        songs={songs}
        selectedIds={selectedIds}
        onToggle={toggle}
        search={search}
        onSearchChange={setSearch}
      />
    </div>
  );
}