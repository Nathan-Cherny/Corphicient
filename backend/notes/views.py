from django.shortcuts import render
from notes.models import *
from django.db.models import F
from django.http import FileResponse, HttpResponse
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializer import *
from .forms import FormSerializer
from rest_framework import generics, status

# Create your views here.


@api_view(["GET"])
def get_sections(request):
    queryset = Section.objects.all()
    serializer = SectionSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def add_section(request):
    data = request.data

    serializer = SectionSerializer(data=data)

    if serializer.is_valid():

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_section_form(request):
    serializer = FormSerializer(Section)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def add_note_to_section(request, pk):
    try:
        section = Section.objects.get(pk=pk)
    except Section.DoesNotExist:
        return Response(
            {"error": "Section not found"}, status=status.HTTP_404_NOT_FOUND
        )

    serializer = NoteSerializer(data=request.data)

    if serializer.is_valid():
        note = serializer.save()
        section.notes.add(note)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def delete_section(request, pk):
    try:
        section = Section.objects.get(pk=pk)
    except Section.DoesNotExist:
        return Response(
            {"error": "Section not found"}, status=status.HTTP_404_NOT_FOUND
        )

    section.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["PATCH"])
def update_section(request, pk):
    try:
        section = Section.objects.get(pk=pk)
    except Section.DoesNotExist:
        return Response(
            {"error": "Section not found"}, status=status.HTTP_404_NOT_FOUND
        )

    serializer = SectionSerializer(section, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def add_note(request):
    data = request.data

    serializer = NoteSerializer(data=data)

    if serializer.is_valid():

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_note_form(request):
    serializer = FormSerializer(Note)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["DELETE"])
def delete_note(request, pk):
    try:
        note = Note.objects.get(pk=pk)
    except Note.DoesNotExist:
        return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)

    note.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["PATCH"])
def update_note(request, pk):
    try:
        note = Note.objects.get(pk=pk)
    except Note.DoesNotExist:
        return Response({"error": "Note not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = NoteSerializer(note, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH"])
def update_note_order(request, pk):
    try:
        section = Section.objects.get(pk=pk)
    except Section.DoesNotExist:
        return Response(
            {"error": "Section not found"}, status=status.HTTP_404_NOT_FOUND
        )

    note_ids = request.data.get("notes")

    if not isinstance(note_ids, list):
        return Response(
            {"error": "notes must be a list of note IDs"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    section_notes = SectionNote.objects.filter(section=section, note_id__in=note_ids)

    section_note_map = {
        section_note.note_id: section_note for section_note in section_notes
    }

    for order, note_id in enumerate(note_ids):
        section_note = section_note_map.get(note_id)

        if section_note is None:
            return Response(
                {"error": f"Note {note_id} is not in this section"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        section_note.order = order
        section_note.save()

    return Response({"success": True})
