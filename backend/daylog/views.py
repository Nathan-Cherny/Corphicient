from django.shortcuts import render
from .models import *
from rest_framework.response import Response
from .serializer import *
from rest_framework.decorators import api_view
from rest_framework import generics, status

@api_view(["GET"])
def get_daylogs(request):
    queryset = DayLog.objects.all()
    serializer = DayLogSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def add_daylog(request):
    data = request.data
    serializer = DayLogSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
