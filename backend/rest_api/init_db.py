from acc_mgmt.models import Player, User
import os
try :
    admin           = User.objects.get(username=os.environ['DJANGO_SUPERUSER_USERNAME'])
    admin_player    = Player(user=admin)
    admin_player.save()
except :
    pass