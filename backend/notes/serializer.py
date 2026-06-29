from rest_framework import serializers
from .models import *


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "name", "note"]
        read_only_fields = []


class SectionSerializer(serializers.ModelSerializer):
    notes = serializers.PrimaryKeyRelatedField(many=True, queryset=Note.objects.all())
    
    class Meta:
        model = Section
        fields = ["id", "name", "notes"]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["notes"] = NoteSerializer(instance.notes.all(), many=True).data
        return rep  

    def update(self, instance, validated_data):
        notes = validated_data.pop("notes", None)
        instance = super().update(instance, validated_data)
        if notes is not None:
            instance.notes.set(notes)
        return instance