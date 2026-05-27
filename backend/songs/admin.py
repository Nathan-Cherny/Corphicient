from django.contrib import admin
from .models import Song

@admin.register(Song)
class FoodTruckAdmin(admin.ModelAdmin):
    list_display = ('name', 'href')
    search_fields = ('name',)