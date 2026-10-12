import datetime
import importlib

from django.apps import apps
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from .models import Song, Playlist
from .filters import SONG_FILTERS, SongFilter, FilterError, clean_filters, filter_songs


def make_song(name, album="", days_ago=0, **kwargs):
    return Song.objects.create(
        name=name,
        href="https://example.com",
        album=album,
        date_created=timezone.now() - datetime.timedelta(days=days_ago),
        **kwargs,
    )


class FilterSongsTests(TestCase):
    def setUp(self):
        self.stronger = make_song("Stronger", album="Graduation", days_ago=10)
        self.flashing = make_song("Flashing Lights", album="Graduation", days_ago=5)
        self.heartless = make_song("Heartless", album="808s", days_ago=1)

    def names(self, filters, specs=None):
        return sorted(filter_songs(Song.objects.all(), filters, specs).values_list("name", flat=True))

    def test_no_filters_returns_everything(self):
        self.assertEqual(len(self.names({})), 3)
        self.assertEqual(len(self.names({"name": "", "album": "", "since": ""})), 3)

    def test_album_is_an_exact_match(self):
        make_song("Extra", album="Graduation Remixes")
        self.assertEqual(self.names({"album": "Graduation"}), ["Flashing Lights", "Stronger"])

    def test_name_is_case_insensitive_contains(self):
        self.assertEqual(self.names({"name": "FLASH"}), ["Flashing Lights"])

    def test_since_keeps_songs_added_on_or_after_the_day(self):
        day = (timezone.now() - datetime.timedelta(days=6)).date().isoformat()
        self.assertEqual(self.names({"since": day}), ["Flashing Lights", "Heartless"])

    def test_since_skips_songs_with_no_date(self):
        Song.objects.create(name="Undated", href="x", date_created=None)
        self.assertNotIn("Undated", self.names({"since": "2000-01-01"}))

    def test_filters_combine(self):
        self.assertEqual(self.names({"album": "Graduation", "name": "strong"}), ["Stronger"])

    def test_every_registered_filter_can_be_applied(self):
        # guards against a SongFilter whose field/lookup doesn't actually work on Song
        samples = {"text": "a", "select": "Graduation", "date": "2000-01-01", "multiselect": ["Graduation"]}
        for spec in SONG_FILTERS:
            with self.subTest(filter=spec.key):
                filter_songs(Song.objects.all(), {spec.key: samples[spec.type]}).count()


class FilterRegistryTests(TestCase):
    """New filters are meant to be just a SongFilter(...) line, so test the machinery with made-up ones."""

    def setUp(self):
        make_song("Stronger", album="Graduation", days_ago=10)
        make_song("Flashing Lights", album="Graduation", days_ago=5)
        make_song("Heartless", album="808s", days_ago=1)

    def names(self, filters, specs):
        return sorted(filter_songs(Song.objects.all(), filters, specs).values_list("name", flat=True))

    def test_multiselect_matches_any_of_the_values(self):
        specs = [SongFilter("albums", "Albums", field="album", lookup="in", type="multiselect")]
        self.assertEqual(
            self.names({"albums": ["808s", "Graduation"]}, specs), ["Flashing Lights", "Heartless", "Stronger"]
        )
        self.assertEqual(self.names({"albums": ["808s"]}, specs), ["Heartless"])
        self.assertEqual(self.names({"albums": []}, specs), ["Flashing Lights", "Heartless", "Stronger"])

    def test_text_lookups(self):
        specs = [SongFilter("starts", "Starts with", field="name", lookup="istartswith", type="text")]
        self.assertEqual(self.names({"starts": "FLASH"}, specs), ["Flashing Lights"])

    def test_on_or_before_includes_the_whole_day(self):
        specs = [SongFilter("until", "Until", field="date_created", lookup="lte", type="date")]
        today = timezone.now().date().isoformat()
        self.assertEqual(len(self.names({"until": today}, specs)), 3)
        long_ago = (timezone.now() - datetime.timedelta(days=7)).date().isoformat()
        self.assertEqual(self.names({"until": long_ago}, specs), ["Stronger"])

    def test_only_filters_in_the_registry_are_accepted(self):
        specs = [SongFilter("album", "Album", field="album", lookup="exact", type="select")]
        with self.assertRaises(FilterError):
            clean_filters({"name": "x"}, specs)

    def test_stored_filters_that_left_the_registry_are_ignored(self):
        # e.g. a filter was removed after a playlist saved it: the playlist shouldn't break
        specs = [SongFilter("album", "Album", field="album", lookup="exact", type="select")]
        self.assertEqual(
            self.names({"album": "808s", "removed_filter": "x"}, specs), ["Heartless"]
        )

    def test_a_filter_with_a_lookup_its_type_cant_use_is_rejected(self):
        with self.assertRaises(ValueError):
            SongFilter("bad", "Bad", field="name", lookup="gte", type="text")
        with self.assertRaises(ValueError):
            SongFilter("bad", "Bad", field="name", lookup="icontains", type="nonsense")

    def test_clean_filters_keeps_only_the_ones_that_are_on(self):
        self.assertEqual(
            clean_filters({"name": "  strong ", "album": "", "since": ""}),
            {"name": "strong"},
        )

    def test_clean_filters_checks_shapes(self):
        for bad in [{"name": 5}, {"since": "nope"}, {"since": "2026-13-45"}, ["x"], {"colour": "red"}]:
            with self.subTest(filters=bad):
                with self.assertRaises(FilterError):
                    clean_filters(bad)

        multi = [SongFilter("albums", "Albums", field="album", lookup="in", type="multiselect")]
        with self.assertRaises(FilterError):
            clean_filters({"albums": "Graduation"}, multi)  # should be a list


class FilterPlaylistTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.stronger = make_song("Stronger", album="Graduation")
        self.heartless = make_song("Heartless", album="808s")

    def create(self, **data):
        return self.client.post("/add_playlist/", data, format="json")

    def test_manual_playlists_still_work(self):
        response = self.create(name="Mine", songs=[self.heartless.id])
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["playlist_type"], "manual")
        self.assertEqual([s["name"] for s in response.data["songs"]], ["Heartless"])

    def test_filter_playlist_resolves_songs_from_its_filters(self):
        response = self.create(name="Grad", playlist_type="filter", filters={"album": "Graduation"})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["playlist_type"], "filter")
        self.assertEqual([s["name"] for s in response.data["songs"]], ["Stronger"])
        # only the filters that are on are stored
        self.assertEqual(response.data["filters"], {"album": "Graduation"})
        # and it holds no songs of its own
        self.assertEqual(Playlist.objects.get(pk=response.data["id"]).songs.count(), 0)

    def test_filter_playlist_picks_up_songs_added_later(self):
        self.create(name="Grad", playlist_type="filter", filters={"album": "Graduation"})
        make_song("Good Life", album="Graduation")

        names = [s["name"] for s in self.client.get("/playlists/").data[0]["songs"]]
        self.assertEqual(sorted(names), ["Good Life", "Stronger"])

    def test_filter_playlist_picks_up_songs_that_stop_matching(self):
        self.create(name="Grad", playlist_type="filter", filters={"album": "Graduation"})
        self.stronger.album = "Other"
        self.stronger.save()

        self.assertEqual(self.client.get("/playlists/").data[0]["songs"], [])

    def test_filter_playlist_without_filters_contains_every_song(self):
        response = self.create(name="Everything", playlist_type="filter")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["filters"], {})
        self.assertEqual(len(response.data["songs"]), 2)

    def test_blank_filters_are_not_stored(self):
        response = self.create(
            name="Grad", playlist_type="filter", filters={"name": "", "album": "Graduation", "since": ""}
        )
        self.assertEqual(response.data["filters"], {"album": "Graduation"})

    def test_filter_playlist_can_be_created_from_form_data(self):
        # same encoding the frontend's add-playlist form uses
        response = self.client.post(
            "/add_playlist/",
            {"name": "Grad", "playlist_type": "filter", "filters": '{"album": "Graduation"}'},
            format="multipart",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual([s["name"] for s in response.data["songs"]], ["Stronger"])

    def test_filter_playlist_rejects_songs(self):
        response = self.create(
            name="Grad", playlist_type="filter", filters={"album": "Graduation"}, songs=[self.stronger.id]
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("songs", response.data)

    def test_filters_are_validated(self):
        for bad in [
            {"colour": "red"},          # unknown filter
            {"album": 5},               # not a string
            {"since": "not a date"},    # not a date
            {"since": "2026-13-45"},    # looks like a date, isn't one
            ["album"],                  # not an object
        ]:
            with self.subTest(filters=bad):
                response = self.create(name="Bad", playlist_type="filter", filters=bad)
                self.assertEqual(response.status_code, 400)
                self.assertIn("filters", response.data)

    def test_manual_playlist_rejects_filters(self):
        response = self.create(name="Mine", filters={"album": "Graduation"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("filters", response.data)

    def test_unknown_playlist_type_is_rejected(self):
        self.assertEqual(self.create(name="Odd", playlist_type="magic").status_code, 400)

    def test_edit_filter_playlist_filters_and_name(self):
        playlist = self.create(name="Grad", playlist_type="filter", filters={"album": "Graduation"}).data

        response = self.client.patch(
            f"/playlists/{playlist['id']}/update/", {"name": "808s", "filters": {"album": "808s"}}, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "808s")
        self.assertEqual([s["name"] for s in response.data["songs"]], ["Heartless"])

    def test_rename_filter_playlist_keeps_its_filters(self):
        playlist = self.create(name="Grad", playlist_type="filter", filters={"album": "Graduation"}).data

        response = self.client.patch(f"/playlists/{playlist['id']}/update/", {"name": "Renamed"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["filters"]["album"], "Graduation")

    def test_playlist_type_cannot_change(self):
        playlist = self.create(name="Mine").data
        response = self.client.patch(
            f"/playlists/{playlist['id']}/update/", {"playlist_type": "filter"}, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_edit_manual_playlist_songs_still_works(self):
        playlist = self.create(name="Mine").data

        response = self.client.patch(
            f"/playlists/{playlist['id']}/update/",
            {"songs": [self.stronger.id], "name": "Mine"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual([s["name"] for s in response.data["songs"]], ["Stronger"])

    def test_song_filters_endpoint_describes_the_registry(self):
        response = self.client.get("/song_filters/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([f["key"] for f in response.data], [spec.key for spec in SONG_FILTERS])
        self.assertEqual(
            set(response.data[0]), {"key", "label", "field", "lookup", "type", "placeholder", "icon"}
        )

    def test_old_stored_filters_are_cleaned_by_the_data_migration(self):
        migration = importlib.import_module("songs.migrations.0019_clean_playlist_filters")

        old = Playlist.objects.create(
            name="Old", playlist_type="filter", filters={"name": "", "album": "Graduation", "since": ""}
        )
        all_albums = Playlist.objects.create(
            name="Old all", playlist_type="filter", filters={"name": "All", "album": "All", "since": ""}
        )
        manual = Playlist.objects.create(name="Manual")

        migration.clean_playlist_filters(apps, None)

        old.refresh_from_db()
        all_albums.refresh_from_db()
        manual.refresh_from_db()
        self.assertEqual(old.filters, {"album": "Graduation"})
        # "All" for album was the old "off"; "All" as a name search is a real search
        self.assertEqual(all_albums.filters, {"name": "All"})
        self.assertEqual(manual.filters, {})

    def test_playlist_form_endpoint_still_works(self):
        response = self.client.get("/get_playlist_form/")
        self.assertEqual(response.status_code, 200)
        names = [f["name"] for f in response.data["fields"]]
        self.assertEqual(names, ["name", "playlist_type", "filters", "songs"])
