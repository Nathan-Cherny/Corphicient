"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Disc,
  Tag,
  Calendar,
  SlidersHorizontal,
  X
} from "lucide-react";

export const DEFAULT_FILTERS = { name: "", album: "All", since: "" }

/**
 * Pure filtering: songs + filters in, matching songs out.
 * To add a filter (e.g. tags), add one more condition here and one field in DEFAULT_FILTERS.
 */
export function filterSongs(songs, filters) {
  const name = filters.name.trim().toLowerCase()
  // "T00:00:00" parses as local midnight instead of UTC midnight
  const since = filters.since ? new Date(`${filters.since}T00:00:00`) : null

  return songs.filter(song =>
    (!name || (song.name ?? "").toLowerCase().includes(name)) &&
    (filters.album === "All" || song.album === filters.album) &&
    (!since || new Date(song.date_created) >= since)
  )
}

/**
 * Owns the filter state. Pass the results to <SongFilter /> and render `filteredSongs`.
 * filteredSongs is derived from songs + filters, so it can never get out of sync with either.
 */
export function useSongFilters(songs) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const filteredSongs = useMemo(() => filterSongs(songs, filters), [songs, filters])

  return { filters, setFilters, filteredSongs }
}

const filterInputClass =
  "w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 shadow-sm " +
  "placeholder:text-gray-400 transition-colors hover:border-gray-400 " +
  "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"

function FilterField({ id, label, icon: Icon, children }) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label
        htmlFor={id}
        className="text-xs font-semibold tracking-wide text-gray-600"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        {children}
      </div>
    </div>
  )
}

/**
 * The filter bar UI. Pair it with useSongFilters:
 *   const { filters, setFilters, filteredSongs } = useSongFilters(songs)
 *   <SongFilter songs={songs} filteredSongs={filteredSongs} filters={filters} setFilters={setFilters} />
 */
export default function SongFilter({ songs, filteredSongs, filters, setFilters }) {
  const songAlbums = useMemo(
    () => ["All", ...Array.from(new Set(songs.map(song => song.album).filter(s => !!s)))],
    [songs]
  )

  const updateFilter = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }))

  const activeCount = [
    filters.name.trim() !== "",
    filters.album !== "All",
    filters.since !== "",
  ].filter(Boolean).length

  return (
    <div className="mx-5 mt-5 rounded-xl border bg-white/60 p-5 shadow-sm backdrop-blur-sm">
      {/* Header */}
      <div className="mb-4 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2 text-gray-800">
          <SlidersHorizontal size={18} />
          <h2 className="text-base font-semibold">Filter songs</h2>
          {activeCount > 0 && (
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
              {activeCount} active
            </span>
          )}
        </div>

        <div className="flex flex-row items-center gap-3">
          <p className="select-none text-sm text-gray-600">
            Showing <b>{filteredSongs.length}</b> of <b>{songs.length}</b>
          </p>
          <button
            type="button"
            disabled={activeCount === 0}
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="flex cursor-pointer flex-row items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-all hover:bg-gray-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          >
            <X size={14} />
            Clear all
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Name */}
        <FilterField id="nameFilter" label="Name" icon={Search}>
          <input
            id="nameFilter"
            type="text"
            placeholder="Search by song name..."
            className={filterInputClass}
            value={filters.name}
            onChange={(e) => updateFilter("name", e.target.value)}
          />
        </FilterField>

        {/* Album */}
        <FilterField id="albumFilter" label="Album" icon={Disc}>
          <select
            id="albumFilter"
            className={`${filterInputClass} cursor-pointer`}
            value={filters.album}
            onChange={(e) => updateFilter("album", e.target.value)}
          >
            {songAlbums.map(sa => (
              <option key={sa} value={sa}>{sa === "All" ? "All albums" : sa}</option>
            ))}
          </select>
        </FilterField>

        {/* Tags */}
        <FilterField id="tagFilter" label="Tags" icon={Tag}>
          <select
            id="tagFilter"
            disabled
            title="Tag filtering is coming soon"
            className={`${filterInputClass} cursor-not-allowed bg-gray-100 text-gray-400`}
          >
            <option>Coming soon</option>
          </select>
        </FilterField>

        {/* Date */}
        <FilterField id="dateFilter" label="Added on or after" icon={Calendar}>
          <input
            id="dateFilter"
            type="date"
            className={filterInputClass}
            value={filters.since}
            onChange={(e) => updateFilter("since", e.target.value)}
          />
        </FilterField>
      </div>
    </div>
  )
}
