from django.contrib import admin
from api.models import Player, Game, FriendInvite, Friendship

admin.site.register(Player)
admin.site.register(Game)
admin.site.register(FriendInvite)
admin.site.register(Friendship)
# Register your models here.
