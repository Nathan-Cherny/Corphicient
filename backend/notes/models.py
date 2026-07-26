from django.db import models

class Note(models.Model):
    name = models.CharField(max_length=50, blank=True)
    note = models.CharField(max_length=1000, blank=True)
    
    def __str__(self):
        return self.name
    
class Section(models.Model):
    name = models.CharField(max_length=100, blank=True)
    notes = models.ManyToManyField(Note, blank=True)
    color = models.CharField(max_length=7, default="#44BBBB")

    def __str__(self):
        return self.name