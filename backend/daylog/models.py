from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone


class DayLog(models.Model):
    note = models.TextField(blank=True, default="")
    mood = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(10.0)])
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        ordering = ["-created_at"]
