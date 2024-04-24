import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer

class   PongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.player_no = self.scope["url_route"]["kwargs"]["player_no"]
        if self.player_no != 1 and self.player_no != 2:
            self.close()
        self.versus_no = 1 if self.player_no == 2 else 2
        self.adversary_name = f"player{self.versus_no}_{self.room_name}"
        self.player_name    = f"player{self.player_no}_{self.room_name}"
        await self.channel_layer.group_add(
            self.player_name, self.channel_name
        )
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.player_name, self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        try :
            obj = json.loads(text_data)
        except :
            obj = {'type' : 'error', 'message' : 'Invalid JSON'}
        await self.channel_layer.group_send(
            self.adversary_name,
            {
                "type" : "send_packet",
                "message" : json.dumps(obj)
            }
        )

    async def send_packet(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"message": message}))