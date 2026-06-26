from django.shortcuts import render
from notes.models import *
from django.db.models import F
from django.http import FileResponse, HttpResponse
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
@api_view(["POST"])
def add_song(request):
    data = request.data

    serializer = SongSerializer(data=data)

    if serializer.is_valid():

        song_data = download_song(data["href"], data["name"])
        serializer.save(src=song_data["location"], duration=song_data["duration"])

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)