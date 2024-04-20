from django.db import models
from django.contrib.auth.models import User

class   Player(models.Model):

    ONLINE = 'ONLINE'
    OFFLINE = 'OFFLINE'
    INGAME = 'INGAME'

    STATUS_CHOICES = {
        OFFLINE : 'Offline',
        ONLINE : 'Online',
        INGAME : 'In-game'
    }

    avatar      = models.CharField(max_length=36,
                                blank=True)
    games_no    = models.PositiveBigIntegerField(default=0,
                                             blank=False)
    wins        = models.PositiveIntegerField(default=0,
                                       blank=False)
    losses      = models.PositiveIntegerField(default=0,
                                       blank=False)
    score       = models.PositiveIntegerField(default=0,
                                        blank=False)
    status      = models.CharField(max_length=20,
                              choices=STATUS_CHOICES,
                              default=OFFLINE,
                              blank=False)
    
class   Friends(models.Model):
    created_on  = models.DateTimeField(auto_now_add=True)
    friend1     = models.ForeignKey(User,
                                    on_delete=models.CASCADE,
                                    related_name='friend1_set')
    friend2     = models.ForeignKey(User,
                                    on_delete=models.CASCADE,
                                    related_name='friend2_set')

class   Matches(models.Model):
    player1         = models.ForeignKey(User,
                                        blank=False,
                                        null=True,
                                        on_delete=models.SET_NULL,
                                        related_name='player1_set')
    player2         = models.ForeignKey(User,
                                        blank=False,
                                        null=True,
                                        on_delete=models.SET_NULL,
                                        related_name='player2_set')
    score_player1   = models.PositiveIntegerField()
    score_player2   = models.PositiveIntegerField()