"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Disc,
  Tag,
  Calendar,
  ListFilter,
  SlidersHorizontal,
  X
} from "lucide-react";
import axiosClient from "@/app/axiosClient";
import {
  countActiveFilters,
  emptyValue,
  filterSongs,
  getFilterOptions,
} from "./SongFilterFunctions";

/*
 * Nothing in this file names a specific filter. What can be filtered by is defined once, in
 * backend/songs/filters.py, and loaded from the backend. To add a filter, add it there.
 */

let cachedSpecs = null
let pendingSpecs = null

function loadSongFilterSpecs() {
  if (cachedSpecs) return Promise.resolve(cachedSpecs)

  if (!pendingSpecs) {
    pendingSpecs = axiosClient("song_filters/", null, null, "GET")
      .then((specs) => (cachedSpecs = specs))
      .catch((err) => {
        pendingSpecs = null // so the next component to ask tries again
        throw err
      })
  }

  return pendingSpecs
}

/** The filters songs can be filtered by, from the backend. Empty until they've loaded. */
export function useSongFilterSpecs() {
  const [specs, setSpecs] = useState(cachedSpecs ?? [])

  useEffect(() => {
    let cancelled = false

    loadSongFilterSpecs()
      .then((loaded) => !cancelled && setSpecs(loaded))
      .catch(() => {}) // axiosClient already logged it; the filter UI just stays empty

    return () => {
      cancelled = true
    }
  }, [])

  return specs
}

/**
 * Owns the filter state. Pass the results to <SongFilter /> and render `filteredSongs`.
 * filteredSongs is derived from songs + filters, so it can never get out of sync with either.
 * `filters` only has the filters that are on, e.g. { album: "Graduation" }.
 */
export function useSongFilters(songs) {
  const specs = useSongFilterSpecs()
  const [filters, setFilters] = useState({})
  const filteredSongs = useMemo(
    () => filterSongs(songs, specs, filters),
    [songs, specs, filters]
  )

  return { filters, setFilters, filteredSongs }
}

const filterInputClass =
  "w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-800 shadow-sm " +
  "placeholder:text-gray-400 transition-colors hover:border-gray-400 " +
  "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"

// A spec can hint at an icon; otherwise its type decides
const ICONS = { search: Search, disc: Disc, tag: Tag, calendar: Calendar }
const TYPE_ICONS = { text: Search, select: ListFilter, date: Calendar, multiselect: Tag }

function FilterField({ id, label, icon: Icon, children }) {
  const labelClass = "text-xs font-semibold tracking-wide text-gray-600"

  return (
    <div className="flex flex-col gap-1.5 text-left">
      {id ? (
        <label htmlFor={id} className={labelClass}>{label}</label>
      ) : (
        <span className={labelClass}>{label}</span>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}
        {children}
      </div>
    </div>
  )
}

/** One input, chosen by the type of filter */
function SongFilterControl({ spec, id, value, onChange, songs }) {
  const options = useMemo(() => {
    if (spec.type !== "select" && spec.type !== "multiselect") return []

    // keep a value that's currently selected visible, even if no loaded song has it
    const selected = Array.isArray(value) ? value : value ? [value] : []
    return [...new Set([...getFilterOptions(songs, spec), ...selected])]
  }, [songs, spec, value])

  const Icon = ICONS[spec.icon] ?? TYPE_ICONS[spec.type]

  switch (spec.type) {
    case "select":
      return (
        <FilterField id={id} label={spec.label} icon={Icon}>
          <select
            id={id}
            className={`${filterInputClass} cursor-pointer`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Any {spec.label.toLowerCase()}</option>
            {options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </FilterField>
      )

    case "multiselect":
      return (
        <FilterField label={spec.label}>
          <div className="flex min-h-[2.25rem] flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-white p-1.5 shadow-sm">
            {options.length === 0 && (
              <span className="px-1.5 text-sm text-gray-400">Nothing to pick yet</span>
            )}
            {options.map((option) => {
              const selected = value.includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    onChange(
                      selected ? value.filter((v) => v !== option) : [...value, option]
                    )
                  }
                  className={`cursor-pointer rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                    selected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </FilterField>
      )

    case "date":
      return (
        <FilterField id={id} label={spec.label} icon={Icon}>
          <input
            id={id}
            type="date"
            className={filterInputClass}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </FilterField>
      )

    default: // "text"
      return (
        <FilterField id={id} label={spec.label} icon={Icon}>
          <input
            id={id}
            type="text"
            placeholder={spec.placeholder}
            className={filterInputClass}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </FilterField>
      )
  }
}

/**
 * Just the filter inputs (no card, no header), one per filter the backend defines, so other
 * places can reuse them, e.g. the filter playlist form. `songs` is only used to work out which
 * values to offer in dropdowns. Pass a unique `idPrefix` if two sets of fields can be on screen
 * at once (keeps input ids unique).
 */
export function SongFilterFields({ songs, filters, setFilters, idPrefix = "" }) {
  const specs = useSongFilterSpecs()

  if (specs.length === 0) {
    return <p className="text-sm text-gray-500">Loading filters...</p>
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {specs.map((spec) => (
        <SongFilterControl
          key={spec.key}
          spec={spec}
          id={`${idPrefix}${spec.key}Filter`}
          songs={songs}
          value={filters[spec.key] ?? emptyValue(spec)}
          onChange={(value) => setFilters((prev) => ({ ...prev, [spec.key]: value }))}
        />
      ))}
    </div>
  )
}

/**
 * The filter bar UI. Pair it with useSongFilters:
 *   const { filters, setFilters, filteredSongs } = useSongFilters(songs)
 *   <SongFilter songs={songs} filteredSongs={filteredSongs} filters={filters} setFilters={setFilters} />
 */
export default function SongFilter({ songs, filteredSongs, filters, setFilters, setOpen }) {
  const specs = useSongFilterSpecs()
  const activeCount = countActiveFilters(specs, filters)

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
            onClick={() => setFilters({})}
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
