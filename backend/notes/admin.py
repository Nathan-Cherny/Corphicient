from django.contrib import admin

from .models import *


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('name', 'note')
    search_fields = ('name',)


class SectionNoteInline(admin.TabularInline):
    model = SectionNote
    extra = 0
    ordering = ('order',)
    fields = ('note', 'order')


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    inlines = [SectionNoteInline]