from django.shortcuts import render
from .models import *
from rest_framework.response import Response
from .serializer import *
from .tag_loader import get_tags
from rest_framework.decorators import api_view
from rest_framework import generics, status
from django.db import transaction

MAX_BULK_DAYLOGS = 5000

@api_view(["GET"])
def get_daylogs(request):
    queryset = DayLog.objects.all()
    serializer = DayLogSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_daylog_tags(request):
    return Response({"tags": get_tags()})


@api_view(["POST"])
def add_daylog(request):
    data = request.data
    serializer = DayLogSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def add_daylogs(request):
    """Bulk import. Takes a JSON list of daylogs (or {"daylogs": [...]}) and saves them all or none."""
    data = request.data
    if isinstance(data, dict) and "daylogs" in data:
        data = data["daylogs"]

    if not isinstance(data, list):
        return Response({"detail": "Expected a list of daylogs."}, status=status.HTTP_400_BAD_REQUEST)
    if len(data) == 0:
        return Response({"detail": "The list is empty."}, status=status.HTTP_400_BAD_REQUEST)
    if len(data) > MAX_BULK_DAYLOGS:
        return Response(
            {"detail": f"Too many daylogs ({len(data)}); the limit is {MAX_BULK_DAYLOGS}."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = DayLogSerializer(data=data, many=True)
    if not serializer.is_valid():
        # Depending on the DRF version, serializer.errors is either a list with one dict per item
        # ({} for the valid ones) or a dict that only holds the failing items, keyed by index.
        raw = serializer.errors
        pairs = raw.items() if isinstance(raw, dict) else enumerate(raw)
        errors = [
            {"index": int(i), "errors": item_errors}
            for i, item_errors in pairs
            if item_errors
        ]
        return Response({"detail": "Some daylogs are invalid; nothing was saved.", "errors": errors},
                        status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        serializer.save()

    return Response({"created": len(data)}, status=status.HTTP_201_CREATED)
