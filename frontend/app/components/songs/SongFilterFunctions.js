// Song filtering that is driven entirely by the filter definitions ("specs") from the backend
// (backend/songs/filters.py, served at song_filters/). Nothing in here names a specific filter,
// so adding one on the backend needs no change here.
//
// A spec looks like { key, label, field, lookup, type, placeholder, icon }.
// `filters` is a plain object of just the filters that are on, e.g. { album: "Graduation" }.

// How each lookup compares a song's value to what the filter asks for.
// These mirror the Django lookups the backend uses for the same filter.
const LOOKUPS = {
  icontains: (value, wanted) => String(value).toLowerCase().includes(wanted.toLowerCase()),
  istartswith: (value, wanted) => String(value).toLowerCase().startsWith(wanted.toLowerCase()),
  iexact: (value, wanted) => String(value).toLowerCase() === wanted.toLowerCase(),
  exact: (value, wanted) => String(value) === wanted,
  // "T00:00:00" parses as local midnight instead of UTC midnight
  gte: (value, wanted) => new Date(value) >= new Date(`${wanted}T00:00:00`),
  lte: (value, wanted) => new Date(value) <= new Date(`${wanted}T23:59:59.999`),
  in: (value, wanted) => wanted.includes(String(value)),
}

/**
 * Every value a song has at `path`, following the same "a__b" paths the backend uses.
 * Lists are flattened, so "tags__name" gives the name of every tag the song has.
 */
export function getValues(song, path) {
  let values = [song]

  for (const part of path.split("__")) {
    values = values.flatMap((v) => {
      const next = v?.[part]
      return Array.isArray(next) ? next : [next]
    })
  }

  return values.filter((v) => v !== null && v !== undefined)
}

/** The value of a filter that means "off" */
export function emptyValue(spec) {
  return spec.type === "multiselect" ? [] : ""
}

/** Whether a filter's value actually narrows anything down */
export function isActive(spec, value) {
  if (spec.type === "multiselect") return Array.isArray(value) && value.length > 0
  return typeof value === "string" && value.trim() !== ""
}

/** Whether one song passes one filter. A song passes if any of its values at the field match. */
export function matchesFilter(song, spec, value) {
  const compare = LOOKUPS[spec.lookup]
  if (!compare) return true // a lookup this frontend doesn't know: don't hide songs over it

  const wanted = Array.isArray(value) ? value : value.trim()
  return getValues(song, spec.field).some((v) => compare(v, wanted))
}

/** Songs that pass every filter that's on */
export function filterSongs(songs, specs, filters) {
  const active = specs.filter((spec) => isActive(spec, filters[spec.key]))
  if (active.length === 0) return songs

  return songs.filter((song) =>
    active.every((spec) => matchesFilter(song, spec, filters[spec.key])),
  )
}

export function countActiveFilters(specs, filters) {
  return specs.filter((spec) => isActive(spec, filters[spec.key])).length
}

/** Just the filters that are on, with values tidied, as they're sent to / stored by the backend */
export function cleanFilters(specs, filters) {
  const cleaned = {}

  for (const spec of specs) {
    const value = filters[spec.key]
    if (!isActive(spec, value)) continue

    cleaned[spec.key] = Array.isArray(value) ? value : value.trim()
  }

  return cleaned
}

/** Short descriptions of the filters that are on, e.g. ["Album: Graduation"] */
export function describeFilters(specs, filters) {
  return specs
    .filter((spec) => isActive(spec, filters?.[spec.key]))
    .map((spec) => {
      const value = filters[spec.key]
      return `${spec.label}: ${Array.isArray(value) ? value.join(", ") : value.trim()}`
    })
}

/** The distinct values songs have for a filter's field, sorted. Used for dropdowns and chips. */
export function getFilterOptions(songs, spec) {
  const values = songs
    .flatMap((song) => getValues(song, spec.field))
    .map(String)
    .filter((v) => v !== "")

  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}
