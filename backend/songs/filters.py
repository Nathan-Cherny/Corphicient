"""Song filters: the single place that defines what a song can be filtered by.

Both the backend (filter playlists, API validation) and the frontend (the filter bar, the
filter playlist form, matching songs in the browser) are driven by SONG_FILTERS below. The
frontend fetches it from the `song_filters/` endpoint, so nothing else needs to know which
filters exist.

HOW TO ADD A FILTER
    1. Make sure the data exists: a field on Song, and (if it's not a plain field) that
       SongSerializer returns it. Add a migration if you added a model field.
    2. Add one SongFilter(...) line to SONG_FILTERS. That's it. The filter bar shows it, filter
       playlists can use it, and the API validates and applies it.

    Example, a plain field:
        SongFilter("artist", "Artist", field="artist", lookup="icontains", type="text")

    Example, tags as a many-to-many (Song.tags -> Tag.name):
        SongFilter("tags", "Tags", field="tags__name", lookup="in", type="multiselect", icon="tag")
      For this one SongSerializer should return `tags` as a list of {"name": ...} objects, since
      the frontend reads the same `tags__name` path from each song it has.

Filters are stored sparsely, as {key: value} for just the filters that are switched on, e.g.
{"album": "Graduation"}. A missing key means "don't filter on this", so adding a filter here
never needs a data migration for existing filter playlists.
"""

import datetime
from dataclasses import dataclass, asdict

from django.conf import settings
from django.utils import timezone
from django.utils.dateparse import parse_date


# What each type of filter looks like in the UI, how its value is shaped, and which lookups
# make sense for it. (The frontend implements exactly these lookups; see SongFilterFunctions.js.)
FILTER_TYPES = {
    "text": {"lookups": ("icontains", "istartswith", "iexact")},  # value: a string
    "select": {"lookups": ("exact",)},                            # value: one of the song values
    "date": {"lookups": ("gte", "lte")},                          # value: "YYYY-MM-DD"
    "multiselect": {"lookups": ("in",)},                          # value: a list of song values
}


class FilterError(ValueError):
    """Raised when a filters dict isn't valid."""


@dataclass(frozen=True)
class SongFilter:
    key: str          # name of the filter in the filters dict, the API and the UI
    label: str        # shown in the UI
    field: str        # Song field it filters on; may span relations, e.g. "tags__name"
    lookup: str       # a Django lookup that suits the type, e.g. "icontains" (see FILTER_TYPES)
    type: str         # "text", "select", "date" or "multiselect"
    placeholder: str = ""
    icon: str = ""    # optional icon hint for the UI: "search", "disc", "tag" or "calendar"

    def __post_init__(self):
        if self.type not in FILTER_TYPES:
            raise ValueError(f"Filter '{self.key}': unknown type '{self.type}'.")
        if self.lookup not in FILTER_TYPES[self.type]["lookups"]:
            raise ValueError(
                f"Filter '{self.key}': a {self.type} filter can't use the '{self.lookup}' lookup "
                f"(use one of: {', '.join(FILTER_TYPES[self.type]['lookups'])})."
            )

    def to_dict(self):
        return asdict(self)


SONG_FILTERS = [
    SongFilter("name", "Name", field="name", lookup="icontains", type="text",
               placeholder="Search by song name...", icon="search"),
    SongFilter("album", "Album", field="album", lookup="exact", type="select", icon="disc"),
    SongFilter("since", "Added on or after", field="date_created", lookup="gte", type="date",
               icon="calendar"),
]


def _check_unique_keys(specs):
    keys = [spec.key for spec in specs]
    duplicates = {key for key in keys if keys.count(key) > 1}
    if duplicates:
        raise ValueError(f"Duplicate song filter key(s): {', '.join(sorted(duplicates))}")


_check_unique_keys(SONG_FILTERS)


def clean_filters(filters, specs=None, strict=True):
    """Validates a filters dict and returns it in its stored form: only the filters that are on.

    Empty values (blank text, no date, an empty list) mean "off" and are dropped.
    Raises FilterError if a value has the wrong shape, or if a key is unknown (unless strict is
    False, which ignores unknown keys; that's for reading filters that were stored earlier, so a
    filter removed from SONG_FILTERS doesn't break the playlists that used it).
    """
    specs = SONG_FILTERS if specs is None else specs

    if filters is None:
        return {}
    if not isinstance(filters, dict):
        raise FilterError("Filters must be an object.")

    by_key = {spec.key: spec for spec in specs}

    unknown = set(filters) - set(by_key)
    if unknown and strict:
        allowed = ", ".join(by_key) or "none"
        raise FilterError(f"Unknown filter(s): {', '.join(sorted(unknown))}. Allowed: {allowed}.")

    cleaned = {}
    for key, value in filters.items():
        if key not in by_key:
            continue
        spec = by_key[key]

        if spec.type == "multiselect":
            if not isinstance(value, list) or not all(isinstance(v, str) for v in value):
                raise FilterError(f"Filter '{key}' must be a list of strings.")
            value = [v.strip() for v in value if v.strip()]
        else:
            if not isinstance(value, str):
                raise FilterError(f"Filter '{key}' must be a string.")
            value = value.strip()

        if spec.type == "date" and value:
            try:
                valid = parse_date(value) is not None
            except ValueError:
                valid = False
            if not valid:
                raise FilterError(f"Filter '{key}' must be a date like 2026-10-11.")

        if value:
            cleaned[key] = value

    return cleaned


def _date_to_datetime(value, lookup):
    """A day, as the start of that day (for "on or after") or the end of it (for "on or before")."""
    day = parse_date(value)
    time = datetime.time.min if lookup == "gte" else datetime.time.max
    moment = datetime.datetime.combine(day, time)
    return timezone.make_aware(moment) if settings.USE_TZ else moment


def filter_songs(queryset, filters, specs=None):
    """Narrows a Song queryset by a filters dict like {"album": "Graduation"}.

    Keys that aren't in the registry (any more) are ignored rather than treated as an error.
    """
    specs = SONG_FILTERS if specs is None else specs
    filters = clean_filters(filters, specs, strict=False)

    spans_relations = False
    for spec in specs:
        if spec.key not in filters:
            continue

        value = filters[spec.key]
        if spec.type == "date":
            value = _date_to_datetime(value, spec.lookup)

        queryset = queryset.filter(**{f"{spec.field}__{spec.lookup}": value})
        spans_relations = spans_relations or "__" in spec.field

    # joining across a many-to-many can return the same song more than once
    return queryset.distinct() if spans_relations else queryset
