from django.urls import re_path, path
from .consumers import PongConsumer

websocket_urlpatterns = [
                        path("ws/room/<str:room_name>/<int:player_no>", PongConsumer.as_asgi()),
                        ]