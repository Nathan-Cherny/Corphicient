// SongSelect.jsx
"use client"

import { useMemo } from "react";

export default function SongSelect({ songs, selectedIds, onToggle, search, onSearchChange }) {
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return songs.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.artist?.toLowerCase().includes(q)
    );
  }, [songs, search]);

  return (
    <>
      <input
        type="text"
        placeholder="Search songs…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
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
              onClick={() => onToggle(song.id)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  onToggle(song.id);
                }
              }}
              className={`song-row h-full ${on ? "selected bg-green-500/50 font-bold" : ""} border p-5 flex flex-row hover:cursor-pointer`}
            >
              <span className="flex-1 truncate">{song.name}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}