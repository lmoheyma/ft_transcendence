from rest_framework import viewsets, views
from .models import Player
from .serializers import ScoreboardSerializer, \
                            RegisterSerializer, \
                            AccountUpdateSerializer
from rest_framework.permissions import IsAuthenticated

class   ScoreboardViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all().order_by('score')
    serializer_class    = ScoreboardSerializer
    http_method_names   = ['get', ]

class   RegisterViewSet(viewsets.ModelViewSet):
    http_method_names   = ['post', ]
    serializer_class    = RegisterSerializer

class   AccountUpdateView(viewsets.ModelViewSet):
    http_method_names   = ['update', ]
    serializer_class    = AccountUpdateSerializer
    permission_classes  = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)