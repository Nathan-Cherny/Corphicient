from rest_framework import serializers
from .models import *
from .tag_loader import get_tags


class DayLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DayLog
        fields = ["note", "mood", "tags", "created_at"]
        read_only_fields = ["created_at"]

    def validate_tags(self, value):
        # Tags are defined in daylog/tags.py; a log can only use tags from there.
        if not isinstance(value, list) or not all(isinstance(tag, str) for tag in value):
            raise serializers.ValidationError("Tags must be a list of strings.")

        allowed = get_tags()
        unknown = [tag for tag in value if tag not in allowed]
        if unknown:
            raise serializers.ValidationError(f"Unknown tags: {', '.join(unknown)}")

        # keep the order they were picked in, without duplicates
        return list(dict.fromkeys(value))
