from django.db import models
from django.contrib.auth.models import User

class   Player(models.Model):

    ONLINE = 'ONLINE'
    OFFLINE = 'OFFLINE'
    INGAME = 'INGAME'

    STATUS_CHOICES = (
        (OFFLINE , 'Offline'),
        (ONLINE  , 'Online'),
        (INGAME  , 'In-game')
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

class   FriendInvite(models.Model):
    sender         = models.ForeignKey(Player,
                                        blank=False,
                                        null=True,
                                        on_delete=models.SET_NULL,
                                        related_name='player1_invites')
    receiver       = models.ForeignKey(Player,
                                        blank=False,
                                        null=True,
                                        on_delete=models.SET_NULL,
                                        related_name='player2_invites')
    created_on  = models.DateTimeField(auto_now_add=True)

class   Friend(models.Model):
    created_on  = models.DateTimeField(auto_now_add=True)
    friend1     = models.ForeignKey(Player,
                                    on_delete=models.CASCADE,
                                    related_name='friend1_set')
    friend2     = models.ForeignKey(Player,
                                    on_delete=models.CASCADE,
                                    related_name='friend2_set')

class   Game(models.Model):
    player1         = models.ForeignKey(Player,
                                        blank=False,
                                        null=True,
                                        on_delete=models.SET_NULL,
                                        related_name='player1_set')
    player2         = models.ForeignKey(Player,
                                        blank=False,
                                        null=True,
                                        on_delete=models.SET_NULL,
                                        related_name='player2_set')
    score_player1   = models.PositiveIntegerField()
    score_player2   = models.PositiveIntegerField()
    created_on      = models.DateTimeField(auto_now_add=True)

