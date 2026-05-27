from django.shortcuts import render
from songs.models import Song
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from . serializer import *
from . forms import *

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

        # should actually use request.user, but getting default user for testing rn

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def get_song_form(request):
    data = SongFormSchema(request=request)
    return Response(data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_song(request, pk):
    try:
        song = Song.objects.get(pk=pk)
    except Song.DoesNotExist:
        return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)
    
    song.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)