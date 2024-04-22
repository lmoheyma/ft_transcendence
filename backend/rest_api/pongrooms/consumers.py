import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

class   PongConsumer(WebsocketConsumer):
    def connect(self):
        self.group_name = "test"
        self.room_group_name = self.group_name
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        obj = json.loads(text_data)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type" : obj["type"],
                "message" : json.dumps(obj)
            }
        )

    def host(self, event):
        message = event['message']
        self.send(text_data=json.dumps({"message": message}))
    def client(self, event):
        message = event['message']
        self.send(text_data=json.dumps({"message": message}))