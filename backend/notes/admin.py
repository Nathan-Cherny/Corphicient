from django.contrib import admin
from .models import *

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('name', 'note',)
    search_fields = ('name',)

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)