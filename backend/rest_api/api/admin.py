from django.contrib import admin
from api.models import Player, \
                        Game, \
                        FriendInvite, \
                        Friendship, \
                        Tournament, \
                        TournamentParticipant

admin.site.register(Player)
admin.site.register(Game)
admin.site.register(FriendInvite)
admin.site.register(Friendship)
admin.site.register(Tournament)
admin.site.register(TournamentParticipant)
# Register your models here.
