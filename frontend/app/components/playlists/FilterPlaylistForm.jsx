"use client";

import { useState, useEffect, useMemo } from "react";
import axiosClient from "@/app/axiosClient";
import { useNotification } from "../layout/notification/NotificationContext";
import { SongFilterFields, useSongFilterSpecs } from "../songs/SongFilter";
import { cleanFilters, filterSongs } from "../songs/SongFilterFunctions";

const PREVIEW_COUNT = 5;

/**
 * Create or edit a FilterPlaylist: a playlist that holds no songs of its own, just a name and
 * preset song filters. The backend looks its songs up from the filters every time, so it always
 * contains whatever currently matches.
 *
 *   <FilterPlaylistForm onSave={(name, filters) => addFilterPlaylist(name, filters)} />
 *   <FilterPlaylistForm playlist={playlist} onSave={(name, filters) => patchFilterPlaylist(playlist.id, name, filters)} />
 *
 * `onSave` may be async; if it throws, the error is shown and the form keeps what was typed.
 */
export default function FilterPlaylistForm({
  playlist = null,
  onSave,
  idPrefix = "filterPlaylist-",
}) {
  const notify = useNotification();
  const [songs, setSongs] = useState([]);
  const [name, setName] = useState(playlist?.name ?? "");
  const specs = useSongFilterSpecs();
  // just the filters that are on, e.g. { album: "Graduation" }
  const [filters, setFilters] = useState(playlist?.filters ?? {});
  const [saving, setSaving] = useState(false);

  // All songs, so the album dropdown has options and we can preview what the filters match
  useEffect(() => {
    let cancelled = false;

    axiosClient("songs/", null, null, "GET")
      .then((res) => !cancelled && setSongs(res || []))
      .catch(() => !cancelled && setSongs([]));

    return () => {
      cancelled = true;
    };
  }, []);

  // Same matching the backend does (the date boundary can differ by a few hours of timezone)
  const matches = useMemo(() => filterSongs(songs, specs, filters), [songs, specs, filters]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || saving) return;

    setSaving(true);
    try {
      await onSave(name.trim(), cleanFilters(specs, filters));
      notify({
        message: playlist ? "Edited filter playlist!" : "Created filter playlist!",
      });

      if (!playlist) {
        setName("");
        setFilters({});
      }
    } catch (err) {
      const detail = err?.response?.data
        ? JSON.stringify(err.response.data)
        : err?.message;
      notify({ message: `Couldn't save the filter playlist: ${detail}` });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${idPrefix}name`}
          className="text-sm font-medium text-sky-900"
        >
          Playlist name
        </label>
        <input
          id={`${idPrefix}name`}
          type="text"
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Graduation"
          className="rounded-lg border border-sky-200 bg-white px-3 py-2 text-sky-950 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-sky-900">
          Songs matching these filters are included automatically
        </p>
        <SongFilterFields
          songs={songs}
          filters={filters}
          setFilters={setFilters}
          idPrefix={idPrefix}
        />
      </div>

      <div className="rounded-lg border border-sky-100 bg-sky-50 p-3 text-sm text-sky-950">
        <p>
          Matches <b>{matches.length}</b> of <b>{songs.length}</b> songs right now
        </p>
        {matches.length > 0 && (
          <p className="mt-1 text-xs text-sky-800">
            {matches
              .slice(0, PREVIEW_COUNT)
              .map((s) => s.name)
              .join(", ")}
            {matches.length > PREVIEW_COUNT &&
              ` and ${matches.length - PREVIEW_COUNT} more`}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || !name.trim() || specs.length === 0}
          className="cursor-pointer rounded-lg bg-[#c98f66] px-6 py-2 font-medium text-white shadow-sm transition-colors hover:bg-[#b57a52] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c98f66] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {playlist ? "Save changes" : "Create filter playlist"}
        </button>
      </div>
    </form>
  );
}
