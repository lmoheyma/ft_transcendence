from django.contrib import admin
from acc_mgmt.models import Player, \
                        FriendInvite, \
                        Friendship
from game_mgmt.models import Tournament, \
                        TournamentParticipant, \
                        Game, \
                        TournamentGame

class TourGameAdmin(admin.ModelAdmin):
    list_display = ["tournament",
                    "participant1",
                    "participant2",
                    "round_no"]

class PlayerAdmin(admin.ModelAdmin):
    list_display = ["id",
                    "games_no",
                    "wins",
                    "losses"]

admin.site.register(Player, PlayerAdmin)
admin.site.register(Game)
admin.site.register(FriendInvite)
admin.site.register(Friendship)
admin.site.register(Tournament)
admin.site.register(TournamentParticipant)
admin.site.register(TournamentGame, TourGameAdmin)
# Register your models here.
