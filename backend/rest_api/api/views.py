from rest_framework import viewsets
from .models import Player
from .serializers import ScoreboardSerializer, RegisterSerializer
# Create your views here.

class   ScoreboardViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all().order_by('score').values()
    serializer_class = ScoreboardSerializer
    http_method_names = ['get', ]

class   RegisterViewSet(viewsets.ModelViewSet):
    http_method_names = ['post', ]
    serializer_class = RegisterSerializer

class   UpdateViewSet(viewsets.ModelViewSet):
    http_method_names = ['post', ]
    serializer_class = RegisterSerializer
