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

export function countActiveFilters(filters) {
  return [
    filters.name.trim() !== "",
    filters.album !== "All",
    filters.since !== "",
  ].filter(Boolean).length
}

/** Short human-readable descriptions of the active filters, e.g. ['album: Graduation'] */
export function describeFilters(filters) {
  const parts = []
  if (filters.name?.trim()) parts.push(`name contains "${filters.name.trim()}"`)
  if (filters.album && filters.album !== "All") parts.push(`album: ${filters.album}`)
  if (filters.since) parts.push(`added since ${filters.since}`)
  return parts
}

/**
 * Just the filter inputs (no card, no header), so other places can reuse them, e.g. the
 * filter playlist form. `songs` is only used to build the list of albums to pick from.
 * Pass a unique `idPrefix` if two sets of fields can be on screen at once (keeps input ids unique).
 */
export function SongFilterFields({ songs, filters, setFilters, idPrefix = "" }) {
  const songAlbums = useMemo(
    () => ["All", ...Array.from(new Set(songs.map(song => song.album).filter(s => !!s)))],
    [songs]
  )

  const updateFilter = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }))

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Name */}
      <FilterField id={`${idPrefix}nameFilter`} label="Name" icon={Search}>
        <input
          id={`${idPrefix}nameFilter`}
          type="text"
          placeholder="Search by song name..."
          className={filterInputClass}
          value={filters.name}
          onChange={(e) => updateFilter("name", e.target.value)}
        />
      </FilterField>

      {/* Album */}
      <FilterField id={`${idPrefix}albumFilter`} label="Album" icon={Disc}>
        <select
          id={`${idPrefix}albumFilter`}
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
      <FilterField id={`${idPrefix}tagFilter`} label="Tags" icon={Tag}>
        <select
          id={`${idPrefix}tagFilter`}
          disabled
          title="Tag filtering is coming soon"
          className={`${filterInputClass} cursor-not-allowed bg-gray-100 text-gray-400`}
        >
          <option>Coming soon</option>
        </select>
      </FilterField>

      {/* Date */}
      <FilterField id={`${idPrefix}dateFilter`} label="Added on or after" icon={Calendar}>
        <input
          id={`${idPrefix}dateFilter`}
          type="date"
          className={filterInputClass}
          value={filters.since}
          onChange={(e) => updateFilter("since", e.target.value)}
        />
      </FilterField>
    </div>
  )
}

/**
 * The filter bar UI. Pair it with useSongFilters:
 *   const { filters, setFilters, filteredSongs } = useSongFilters(songs)
 *   <SongFilter songs={songs} filteredSongs={filteredSongs} filters={filters} setFilters={setFilters} />
 */
export default function SongFilter({ songs, filteredSongs, filters, setFilters, setOpen }) {
  const activeCount = countActiveFilters(filters)

  return (
    <div className="mx-5 mt-5 rounded-xl border bg-white/60 p-5 shadow-sm backdrop-blur-sm">
      {/* Header */}
      <div className="mb-4 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2 text-gray-800">
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

      <SongFilterFields songs={songs} filters={filters} setFilters={setFilters} />
    </div>
  )
}

export function SongFilterToggleButton({setFilterOpen}){
  return <SlidersHorizontal className="border cursor-pointer hover:scale-105" onClick={() => setFilterOpen(prev => !prev)} size={18} />
}