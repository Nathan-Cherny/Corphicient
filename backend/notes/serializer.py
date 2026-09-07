from rest_framework import serializers
from .models import *


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "name", "note"]
        read_only_fields = []


class SectionNoteSerializer(serializers.ModelSerializer):
    note = NoteSerializer()

    class Meta:
        model = SectionNote
        fields = ["note", "order"]


class SectionSerializer(serializers.ModelSerializer):
    notes = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Note.objects.all(),
        required=False
    )

    class Meta:
        model = Section
        fields = ["id", "name", "notes", "color"]

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        section_notes = SectionNote.objects.filter(
            section=instance
        ).select_related("note").order_by("order")

        rep["notes"] = SectionNoteSerializer(
            section_notes,
            many=True
        ).data

        return rep

    def update(self, instance, validated_data):
        notes = validated_data.pop("notes", None)

        instance = super().update(instance, validated_data)

        if notes is not None:
            # Remove existing relationships
            SectionNote.objects.filter(section=instance).delete()

            # Recreate them in the order supplied by the frontend
            for order, note in enumerate(notes):
                SectionNote.objects.create(
                    section=instance,
                    note=note,
                    order=order
                )

        return instance