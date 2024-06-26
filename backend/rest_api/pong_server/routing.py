from django.urls import path
from .consumers import PongConsumer, StatusConsumer, TournamentConsumer

websocket_urlpatterns = [
                        path("ws/room/<str:room_name>/<str:token>", PongConsumer.as_asgi()),
                        path("ws/status/<str:token>", StatusConsumer.as_asgi()),
                        path("ws/tournament/<str:room_name>/<str:token>", TournamentConsumer.as_asgi())
                        ]
