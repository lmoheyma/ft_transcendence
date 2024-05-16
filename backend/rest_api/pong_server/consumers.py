import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.authtoken.models import Token
from game_mgmt.models import Game, Player, Tournament
from channels.db import database_sync_to_async
from django.utils import timezone

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
            elif self.game.player1 == None and self.game.player2 != self.user.player :
                self.game.player1 = self.user.player
                self.game.save()
                self.player_no = 1
            elif self.game.player2 == None and self.game.player1 != self.user.player :
                self.game.player2 = self.user.player
                self.game.save()
                self.player_no = 2
            else :
                return connect_status.TOO_MANY_PLAYERS
            return connect_status.SUCCESS
        return connect_status.INVALID_TOKEN

    @database_sync_to_async
    def get_players_info(self):
        packet = {
            "type" : "player",
            "you" : self.player_no
        }
        if self.game.player1 != None :
            packet['player1'] = self.game.player1.user.username
        if self.game.player2 != None :
            packet['player2'] = self.game.player2.user.username
        return packet

    @database_sync_to_async
    def disconnect_match(self):
        try :
            game = Game.objects.get(name=self.room_name)
        except :
            return
        if game.player1 == None or game.player2 == None or self.scope["game"].is_finished == True:
            return
        self.scope["game"].is_finished = True
        game.is_finished    = True
        game.score_player1 = self.scope["game"].stat_tracker['player1_score']
        game.score_player2 = self.scope["game"].stat_tracker['player2_score']
        game.nb_bounces = self.scope["game"].stat_tracker['nb_bounces']
        diff_time = timezone.now() - game.created_on
        diff_float = diff_time.seconds + diff_time.microseconds / (10 ** 6)
        game.game_duration = diff_float
        if game.score_player2 == 3 or game.score_player1 == 3 :
            if game.score_player2 > game.score_player1 :
                game.winner = game.player2
            else :
                game.winner = game.player1
        else :
            if self.player_no == 1 :
                game.winner = game.player2
            else :
                game.winner = game.player1
        if game.winner == game.player1 :
            game.player1.wins += 1
            game.player2.losses += 1
        else :
            game.player2.wins += 1
            game.player1.losses += 1
        if game.is_tournament == True :
            tournament = [i for i in game.tournament.all()][0].tournament
            tour_games = tournament.games
            if len([i for i in tour_games.all() if i.game.is_finished == False]):
                tournament.is_finished = True
                tournament.save()
        game.player1.games_no += 1
        game.player2.games_no += 1
        game.save()
        game.player1.save()
        game.player2.save()

    async def connect(self):
        self.user = None
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.token = self.scope["url_route"]["kwargs"]["token"]
        self.scope['game'].no_players += 1
        ret = await self.token_connect()
        if ret != connect_status.SUCCESS:
            await self.close()
            return
        await self.channel_layer.group_add(
            self.room_name + str(self.player_no), self.channel_name
        )
        packet = await self.get_players_info()
        await self.channel_layer.group_send(
            self.room_name + str(1),
            {
                "type" : "send_packet",
                "message" : json.dumps(packet)
            }
        )
        await self.channel_layer.group_send(
            self.room_name + str(2),
            {
                "type" : "send_packet",
                "message" : json.dumps(packet)
            }
        )
        await self.accept()

    async def disconnect(self, code):
        self.scope['game'].no_players -= 1
        if self.user != None :
            await self.channel_layer.group_discard(
                self.user.username, self.channel_name
            )
            await self.disconnect_match()


    async def receive(self, text_data=None, bytes_data=None):
        try :
            obj = json.loads(text_data)
            obj['connected_clients'] = self.scope['game'].no_players
        except :
            obj = {'type' : 'error', 'message' : 'Invalid JSON'}
        if obj.get('request', None) == "game" and obj.get('type', None) == 'host':
            for k in obj.keys():
                self.scope["game"].stat_tracker[k] = obj[k]
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
            self.player.refresh_from_db()
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

from game_mgmt.serializers import get_tournament_player_games

class   TournamentConsumer(AsyncWebsocketConsumer):
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
    def get_tournament(self):
        try :
            self.tournament = Tournament.objects.get(code=self.room_name)
        except :
            self.tournament = None

    @database_sync_to_async
    def check_is_host(self):
        if self.tournament.creator == self.player :
            return True
        else :
            return False

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.player = None
        await self.get_tournament()
        if await self.token_connect() == True and self.tournament != None:
            self.is_host = await self.check_is_host()
            await self.channel_layer.group_add(
                self.room_name, self.channel_name
            )
            await self.accept()
        else :
            await self.close()

    async def receive(self, text_data=None, bytes_data=None):
        if text_data == 'UPDATE' :
            await self.channel_layer.group_send(
            self.room_name,
            {
                "type" : "send_packet",
                "message" : text_data
            }
        )
        elif text_data == 'START' and self.is_host == True:
            await self.channel_layer.group_send(
            self.room_name,
            {
                "type" : "send_packet",
                "message" : text_data
            }
        )

    async def send_packet(self, event):
        await self.send(text_data=event["message"])

    @database_sync_to_async
    def delete_all_games(self):
            try :
                [i.delete() for i in get_tournament_player_games(self.tournament, self.player)]
                if not self.tournament.is_started :
                    self.tournament.participants.get(player=self.player).delete()
            except :
                pass

    async def disconnect(self, code):
        if self.tournament != None and self.player != None and self.tournament.is_finished == False :
            await self.delete_all_games()
            await self.channel_layer.group_send(
            self.room_name,
                {
                    "type" : "send_packet",
                    "message" : "UPDATE"
                }
            )
