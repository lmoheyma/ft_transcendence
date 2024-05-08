from django.db import models
from django.contrib.auth.models import User
import os, base64

class   Player(models.Model):

    ONLINE = 'ONLINE'
    OFFLINE = 'OFFLINE'
    INGAME = 'INGAME'
    INACTIVE = 'INACTIVE'

    STATUS_CHOICES = (
        (OFFLINE , 'Offline'),
        (ONLINE  , 'Online'),
        (INGAME  , 'In-game'),
        (INACTIVE, 'Inactive')
    )

    user        = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar      = models.ImageField(upload_to='avatars/',
                                    blank=True)
    games_no    = models.PositiveBigIntegerField(default=0)
    wins        = models.PositiveIntegerField(default=0)
    losses      = models.PositiveIntegerField(default=0)
    score       = models.PositiveIntegerField(default=0)
    status      = models.CharField(max_length=20,
                              choices=STATUS_CHOICES,
                              default=OFFLINE)

def     gen_safe_randomcode():
    return base64.urlsafe_b64encode(os.urandom(10))[:-2].decode()

class   FriendInvite(models.Model):
    code        = models.CharField(max_length=14,
                                   default=gen_safe_randomcode,
                                   primary_key=True)
    sender      = models.ForeignKey(Player,
                                        blank=False,
                                        null=True,
                                        on_delete=models.SET_NULL,
                                        related_name='sent_invites')
    receiver    = models.ForeignKey(Player,
                                        blank=False,
                                        null=True,
                                        on_delete=models.SET_NULL,
                                        related_name='received_invites')
    created_on  = models.DateTimeField(auto_now_add=True)

class   Friendship(models.Model):
    created_on  = models.DateTimeField(auto_now_add=True)
    friend1     = models.ForeignKey(Player,
                                    on_delete=models.CASCADE,
                                    related_name='friends1_set')
    friend2     = models.ForeignKey(Player,
                                    on_delete=models.CASCADE,
                                    related_name='friends2_set')

class   Game(models.Model):
    name            = models.CharField(max_length=64,
                                        primary_key=True,
                                        default=gen_safe_randomcode)
    player1         = models.ForeignKey(Player,
                                        blank=True,
                                        null=True,
                                        on_delete=models.SET_NULL,
                                        related_name='history1_set')
    player2         = models.ForeignKey(Player,
                                        blank=True,
                                        null=True,
                                        on_delete=models.SET_NULL,
                                        related_name='history2_set')
    winner          = models.ForeignKey(Player,
                                        blank=True,
                                        null=True,
                                        on_delete=models.SET_NULL,
                                        related_name='games_won')
    score_player1   = models.PositiveIntegerField(default=0)
    score_player2   = models.PositiveIntegerField(default=0)
    created_on      = models.DateTimeField(auto_now_add=True)
    is_finished     = models.BooleanField(default=False, null=False)
    is_tournament   = models.BooleanField(default=False, null=False)

class   Tournament(models.Model):
    code        = models.CharField(max_length=14,
                                   default=gen_safe_randomcode,
                                   primary_key=True)
    created_on      = models.DateTimeField(auto_now_add=True)
    creator         = models.ForeignKey(Player,
                                        blank=True,
                                        null=True,
                                        on_delete=models.CASCADE,
                                        related_name='created_tournaments')
    player_no       = models.PositiveBigIntegerField(default=0)
    winner          = models.ForeignKey(Player,
                                        blank=True,
                                        null=True,
                                        on_delete=models.CASCADE,
                                        related_name='won_tournaments')
    round_no        = models.PositiveSmallIntegerField(default=0)
    is_started      = models.BooleanField(default=False)
    is_finished     = models.BooleanField(default=False)

class   TournamentParticipant(models.Model):
    tournament      = models.ForeignKey(Tournament,
                                        null=False,
                                        on_delete=models.CASCADE,
                                        related_name='participants')
    player          = models.ForeignKey(Player,
                                        null=False,
                                        on_delete=models.CASCADE)
    score           = models.PositiveIntegerField(default=0)

class   TournamentGame(models.Model):
    tournament      = models.ForeignKey(Tournament,
                                        null=False,
                                        on_delete=models.CASCADE,
                                        related_name='games')
    game            = models.ForeignKey(Game,
                                        null=False,
                                        on_delete=models.CASCADE,
                                        related_name='tournament')
    participant1    = models.ForeignKey(Player,
                                        null=False,
                                        on_delete=models.CASCADE,
                                        related_name='p1')
    participant2    = models.ForeignKey(Player,
                                        null=False,
                                        on_delete=models.CASCADE,
                                        related_name='p2')
    round_no        = models.PositiveIntegerField()

