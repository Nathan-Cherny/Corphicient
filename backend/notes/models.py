from django.db import models

class Note(models.Model):
    name = models.CharField(max_length=50)

    note = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return self.name
    
class Section(models.Model):
    name = models.CharField(max_length=100)
    notes = models.ManyToManyField(Note, blank=True)

    def __str__(self):
        return self.name