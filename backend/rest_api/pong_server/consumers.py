import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.authtoken.models import Token
from api.models import Game, Player
from channels.db import database_sync_to_async

connected_clients = set()

class   connect_status:
    SUCCESS             = 0
    TOO_MANY_PLAYERS    = 1
    INVALID_TOKEN       = 2
    ALREADY_CONNECTED   = 3

class   PongConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def token_connect(self):
        try :
            token_obj = Token.objects.get(key=self.token)
        except :
            token_obj = None
        if token_obj != None :
            self.user = token_obj.user
            try :
                game = Game.objects.get(name=self.room_name)
            except :
                game = None
            if game == None :
                game = Game(name=self.room_name, player1=self.user.player)
                self.player_no = 1
                game.save()
            elif game.player1 == None and game.player2 != self.user.player :
                game.player1 = self.user.player
                game.save()
                self.player_no = 1
            elif game.player2 == None and game.player1 != self.user.player :
                game.player2 = self.user.player
                game.save()
                self.player_no = 2
            else :
                return connect_status.TOO_MANY_PLAYERS
            return connect_status.SUCCESS
        return connect_status.INVALID_TOKEN
    
    @database_sync_to_async
    def disconnect_match(self):
        try :
            game = Game.objects.get(name=self.room_name)
        except :
            return
        game.is_finished = True
        if game.is_tournament == True :
            tournament = [i for i in game.tournament.all()][0].tournament
            tour_games = tournament.games
            if len([i for i in tour_games.all() if i.game.is_finished == False]):
                tournament.is_finished = True
                tournament.save()
        game.save()

    async def connect(self):
        self.user = None
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.token = self.scope["url_route"]["kwargs"]["token"]
        connected_clients.add(self.channel_name)
        ret = await self.token_connect()
        if ret != connect_status.SUCCESS:
            await self.close()
            return
        await self.channel_layer.group_add(
            self.room_name + str(self.player_no), self.channel_name
        )
        packet = {
        "type" : "player",
        "you": self.player_no
        }
        await self.channel_layer.group_send(
            self.room_name + str(self.player_no),
            {
                "type" : "send_packet",
                "message" : json.dumps(packet)
            }
        )
        await self.accept()

    async def disconnect(self, code):
        connected_clients.remove(self.channel_name)
        if self.user != None :
            await self.channel_layer.group_discard(
                self.user.username, self.channel_name
            )
        await self.disconnect_match()


    async def receive(self, text_data=None, bytes_data=None):
        try :
            obj = json.loads(text_data)
            obj['connected_clients'] = len(connected_clients)
        except :
            obj = {'type' : 'error', 'message' : 'Invalid JSON'}
        await self.channel_layer.group_send(
            self.room_name + str(((self.player_no - 1) ^ 1 & 1) + 1),
            {
                "type" : "send_packet",
                "message" : json.dumps(obj)
            }
        )

    async def send_packet(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"message": message}))

class   StatusConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def token_connect(self):
        try :
            self.token = self.scope["url_route"]["kwargs"]["token"]
            self.token_obj = Token.objects.get(key=self.token)
            self.player = self.token_obj.user.player
            return True
        except :
            return False

    @database_sync_to_async
    def status_update(self, status):
        try :
            self.player.status = status
            self.player.save()
        except :
            pass

    async def connect(self):
        if await self.token_connect() == True:
            await self.accept()
            await self.status_update(Player.ONLINE)
        else :
            await self.close()
    
    async def receive(self, text_data=None, bytes_data=None):
        await self.status_update(text_data)

    async def disconnect(self, code):
        await self.status_update(Player.OFFLINE)