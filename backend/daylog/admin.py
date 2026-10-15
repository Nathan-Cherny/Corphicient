from django.contrib import admin
from .models import *

# Register your models here.

@admin.register(DayLog)
class DayLogAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'note', "mood", "tags")
    search_fields = ('created_at',)

