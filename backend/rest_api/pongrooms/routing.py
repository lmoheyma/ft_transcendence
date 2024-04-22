from django.urls import re_path, path
from .consumers import WebsocketConsumer

websocket_urlpatterns = [
                        path('ws/room/test', WebsocketConsumer.as_asgi()),
                    ]