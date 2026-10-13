from rest_framework import serializers
from .models import *

class DayLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DayLog
        fields = ["note", "mood", "created_at"]
        read_only_fields = ["created_at"]