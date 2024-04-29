from django.urls import path
from .consumers import PongConsumer

websocket_urlpatterns = [
                        path("ws/room/<str:room_name>/<str:token>", PongConsumer.as_asgi()),
                        ]