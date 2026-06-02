from django.shortcuts import render
from songs.models import *
from django.http import FileResponse, HttpResponse
from django.conf import settings
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from . serializer import *
from . forms import *
from . download import download_song
import os

@api_view(['GET'])
def get_songs(request):
    queryset = Song.objects.all()
    serializer = SongSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def add_song(request):
    data = request.data

    serializer = SongSerializer(data=data)

    if serializer.is_valid():

        song_data = download_song(data["href"], data["name"])
        serializer.save(src=song_data["location"], duration=song_data["duration"])

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def get_song_form(request):
    serializer = FormSerializer(Song)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_song(request, pk):
    try:
        song = Song.objects.get(pk=pk)
    except Song.DoesNotExist:
        return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)
    
    os.remove(song.src)
    song.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def get_playlists(request):
    queryset = Playlist.objects.all()
    serializer = PlaylistSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def add_playlist(request):
    data = request.data

    serializer = PlaylistSerializer(data=data)

    if serializer.is_valid():

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_playlist_form(request):
    serializer = FormSerializer(Playlist)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_playlist(request, pk):
    try:
        playlist = Playlist.objects.get(pk=pk)
    except Playlist.DoesNotExist:
        return Response({"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND)
    
    playlist.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


def serve_audio(request, filename):
    path = os.path.join(settings.MEDIA_ROOT, filename)
    file_size = os.path.getsize(path)
    range_header = request.META.get('HTTP_RANGE', '')
    print(f"Range: {range_header}")

    if range_header:
        start, end = range_header.replace('bytes=', '').split('-')
        start = int(start)
        end = int(end) if end else file_size - 1
        length = end - start + 1

        with open(path, 'rb') as f:
            f.seek(start)
            data = f.read(length)

        response = HttpResponse(data, status=206, content_type='audio/mpeg')
        response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
        response['Accept-Ranges'] = 'bytes'
        response['Content-Length'] = str(length)
        return response

    response = FileResponse(open(path, 'rb'), content_type='audio/mpeg')
    response['Accept-Ranges'] = 'bytes'
    response['Content-Length'] = str(file_size)
    return response