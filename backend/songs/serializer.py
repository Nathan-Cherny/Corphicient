from rest_framework import serializers
from .models import Song


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ["id", "name", "href"]
        read_only_fields = []


class SongFormSerializer(serializers.Serializer):
    def to_representation(self, instance):
        print(self, instance)
        # Assuming 'instance' is a Django model class
        fields = []
        for field in instance._meta.fields:
            if field.name == "id":
                continue

            field_type = "text"
            if field.get_internal_type() in [
                "IntegerField",
                "FloatField",
                "DecimalField",
            ]:
                field_type = "number"
            elif field.get_internal_type() == "BooleanField":
                field_type = "checkbox"
            elif field.get_internal_type() == "DateTimeField":
                field_type = "datetime-local"

            fields.append(
                {
                    "name": field.name,
                    "label": field.verbose_name.title(),
                    "type": field_type,
                    "required": not field.blank,
                    "default": (
                        field.default
                        if field.default != field.empty_strings_allowed
                        else None
                    ),
                    "max_length": getattr(field, "max_length", None),
                }
            )
        return {"fields": fields}
