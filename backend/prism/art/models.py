from django.db import models

class Artwork(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)  # Optional description

    def __str__(self):
        return self.title