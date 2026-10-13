from django.shortcuts import render
from .models import *
from rest_framework.response import Response
from .serializer import *
from rest_framework.decorators import api_view

@api_view(["GET"])
def get_daylogs(request):
    queryset = DayLog.objects.all()
    serializer = DayLogSerializer(queryset, many=True)
    return Response(serializer.data)
