from unittest.mock import patch

from django.test import TestCase

from .models import DayLog


@patch("daylog.serializer.get_tags", return_value=["work", "sleep"])
@patch("daylog.views.get_tags", return_value=["work", "sleep"])
class DayLogTagTests(TestCase):
    def test_get_tags(self, *_):
        res = self.client.get("/get_daylog_tags/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {"tags": ["work", "sleep"]})

    def test_add_daylog_with_tags_from_form_data(self, *_):
        # the frontend sends tags as a JSON string inside multipart form data
        res = self.client.post("/add_daylog/", {"mood": "7.5", "note": "good", "tags": '["work", "sleep", "work"]'})
        self.assertEqual(res.status_code, 201)
        self.assertEqual(DayLog.objects.get().tags, ["work", "sleep"])

    def test_add_daylog_without_tags(self, *_):
        res = self.client.post("/add_daylog/", {"mood": "5"})
        self.assertEqual(res.status_code, 201)
        self.assertEqual(DayLog.objects.get().tags, [])

    def test_unknown_tag_rejected(self, *_):
        res = self.client.post("/add_daylog/", {"mood": "5", "tags": '["nope"]'})
        self.assertEqual(res.status_code, 400)
        self.assertIn("tags", res.json())
        self.assertEqual(DayLog.objects.count(), 0)


@patch("daylog.serializer.get_tags", return_value=["work", "sleep"])
class DayLogBulkImportTests(TestCase):
    def post(self, payload):
        return self.client.post("/add_daylogs/", payload, content_type="application/json")

    def test_bulk_add_keeps_created_at_and_dedupes_tags(self, *_):
        res = self.post([
            {"mood": 7.5, "note": "good", "tags": ["work", "work"], "created_at": "2026-01-02T03:04:05Z"},
            {"mood": 3},
        ])
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.json(), {"created": 2})
        self.assertEqual(DayLog.objects.count(), 2)
        old = DayLog.objects.get(mood=7.5)
        self.assertEqual(old.tags, ["work"])
        self.assertEqual(old.created_at.year, 2026)
        self.assertEqual(old.created_at.month, 1)

    def test_accepts_wrapped_object(self, *_):
        res = self.post({"daylogs": [{"mood": 5}]})
        self.assertEqual(res.status_code, 201)
        self.assertEqual(DayLog.objects.count(), 1)

    def test_one_bad_item_saves_nothing(self, *_):
        res = self.post([{"mood": 5}, {"mood": 11}, {"mood": 4, "tags": ["nope"]}])
        self.assertEqual(res.status_code, 400)
        self.assertEqual([e["index"] for e in res.json()["errors"]], [1, 2])
        self.assertEqual(DayLog.objects.count(), 0)

    def test_rejects_non_list_and_empty(self, *_):
        self.assertEqual(self.post({"mood": 5}).status_code, 400)
        self.assertEqual(self.post([]).status_code, 400)
        self.assertEqual(DayLog.objects.count(), 0)


class MissingTagsFileTests(TestCase):
    def test_no_tags_file_means_no_tags(self):
        with patch.dict("sys.modules", {"daylog.tags": None}):
            res = self.client.get("/get_daylog_tags/")
        self.assertEqual(res.json(), {"tags": []})
