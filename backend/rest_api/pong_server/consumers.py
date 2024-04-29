import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.authtoken.models import Token
from api.models import Game
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
                self.game = Game.objects.get(name=self.room_name)
            except :
                self.game = None
            if self.game == None :
                self.game = Game(name=self.room_name, player1=self.user.player)
                self.player_no = 1
                self.game.save()
            elif self.game.player2 == None:
                if self.game.player1 == self.game.player2 :
                    return connect_status.ALREADY_CONNECTED
                self.game.player2 = self.user.player
                self.game.save()
                self.player_no = 2
            else :
                return connect_status.TOO_MANY_PLAYERS
            return connect_status.SUCCESS
        return connect_status.INVALID_TOKEN

    @database_sync_to_async
    def fetch_username(self, player):
        return player.user.username

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
            self.user.username, self.channel_name
        )
        await self.accept()

    async def disconnect(self, code):
        connected_clients.remove(self.channel_name)
        if self.user != None :
            await self.channel_layer.group_discard(
                self.user.username, self.channel_name
            )

    async def receive(self, text_data=None, bytes_data=None):
        try :
            obj = json.loads(text_data)
            obj['connected_clients'] = len(connected_clients)
        except :
            obj = {'type' : 'error', 'message' : 'Invalid JSON'}
        if self.player_no == 2 :
            target_name = await self.fetch_username(self.game.player1)
        else :
            target_name = await self.fetch_username(self.game.player2)
        await self.channel_layer.group_send(
            target_name,
            {
                "type" : "send_packet",
                "message" : json.dumps(obj)
            }
        )

    async def send_packet(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"message": message}))