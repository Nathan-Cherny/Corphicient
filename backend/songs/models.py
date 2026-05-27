from django.db import models

# Create your models here.
class Song(models.Model):
    name = models.CharField(max_length=50)
    href = models.CharField(max_length=250)

    src = models.CharField(max_length=100, blank=True)
    secondsPlayed = models.IntegerField(blank=True, default=0)
    
    def __str__(self):
        return self.name