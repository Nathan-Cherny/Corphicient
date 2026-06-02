from django.db import models

class Song(models.Model):
    name = models.CharField(max_length=50)
    href = models.CharField(max_length=250)

    src = models.CharField(max_length=100, blank=True)
    secondsPlayed = models.IntegerField(blank=True, default=0)
    duration = models.FloatField(blank=True, default=0)
    
    def __str__(self):
        return self.name
    
class Playlist(models.Model):
    name = models.CharField(max_length=100)
    songs = models.ManyToManyField(Song, blank=True)

    def __str__(self):
        return self.name