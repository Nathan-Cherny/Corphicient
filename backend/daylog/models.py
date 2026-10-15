from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class DayLog(models.Model):
    note = models.TextField(blank=True, default="")
    mood = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(10.0)])
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
