"use client"

import { useState, useEffect, useMemo } from "react";
import { useNotification } from "../layout/notification/NotificationContext";
import axiosClient from "@/app/axiosClient";

export default function EditPlaylist({ playlistSongs, onSave, maxHeight }) {
  const [songs, setSongs] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const notify = useNotification();
  const [loading, setLoading] = useState(true);

  const [change, setChange] = useState(0)

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

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return songs.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.artist?.toLowerCase().includes(q)
    );
  }, [songs, search]);

  function toggle(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleSave() {
    const selected = Array.from(selectedIds);
    onSave?.(selected);
    notify({"message": `Edited Playlist!`})
    setChange(change + 1)
  }

  if (loading) return <p className="text-sm text-muted">Loading songs…</p>;

  return (
    <div className="flex flex-col gap-3" style={{ minWidth: "150px", minHeight: "300px", textWrap: "wrap", width: "fit", "overflowY": "auto", maxHeight: maxHeight ?? "100%"  }}>
      <div className="flex items-center justify-between">
        <span className="text-sm">
          <strong>{selectedIds.size}</strong> in playlist
        </span>
        <button onClick={handleSave} className="btn-primary bg-red-200 p-2" style={{"cursor": "pointer"}} >
          Save changes
        </button>
      </div>

      <input
        type="text"
        placeholder="Search songs…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input"
      />

      <ul className="flex flex-col gap-1.5 max-h-80 overflow-y-auto">
        {filtered.length === 0 && (
          <li className="text-sm text-center text-muted py-8">
            No songs match your search.
          </li>
        )}
        {filtered.map((song) => {
          const on = selectedIds.has(song.id);
          return (
            <li
              key={song.id}
              role="checkbox"
              aria-checked={on}
              tabIndex={0}
              onClick={() => toggle(song.id)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggle(song.id);
                }
              }}
              className={`song-row h-full ${on ? "selected bg-green-500/50 font-bold" : ""} border p-5 flex flex-row hover:cursor-pointer`}
            >
              <span className="flex-1 truncate">{song.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}