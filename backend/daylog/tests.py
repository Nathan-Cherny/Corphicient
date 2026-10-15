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


class MissingTagsFileTests(TestCase):
    def test_no_tags_file_means_no_tags(self):
        with patch.dict("sys.modules", {"daylog.tags": None}):
            res = self.client.get("/get_daylog_tags/")
        self.assertEqual(res.json(), {"tags": []})
