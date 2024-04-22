from django.db import models

# Create your models here.
class Rooms(models.Model):
    name        = models.CharField(max_length=20)
    no_players  = models.PositiveSmallIntegerField()
    created_on  = models.DateTimeField(auto_now_add=True)
