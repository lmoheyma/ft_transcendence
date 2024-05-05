from django.contrib import admin
from api.models import Player, \
                        Game, \
                        FriendInvite, \
                        Friendship, \
                        Tournament, \
                        TournamentParticipant, \
                        TournamentGame



class TourGameAdmin(admin.ModelAdmin):
    list_display = ["tournament",
                    "participant1",
                    "participant2",
                    "round_no"]

admin.site.register(Player)
admin.site.register(Game)
admin.site.register(FriendInvite)
admin.site.register(Friendship)
admin.site.register(Tournament)
admin.site.register(TournamentParticipant)
admin.site.register(TournamentGame, TourGameAdmin)
# Register your models here.
