"""
ASGI config for rest_api project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from .settings import IS_WS
from pong_server.routing import websocket_urlpatterns
from pong_server.middleware import GameMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rest_api.settings')
django_asgi_app = get_asgi_application()

protocols = {}

if IS_WS == False :
    protocols["http"] = get_asgi_application()
if IS_WS == True :
    protocols["websocket"] = \
            GameMiddleware(
            AllowedHostsOriginValidator(
            AuthMiddlewareStack(
                URLRouter(websocket_urlpatterns)
                )
        ))

application = ProtocolTypeRouter(protocols)
