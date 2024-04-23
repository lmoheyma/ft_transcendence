from rest_framework import viewsets, views, status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from .models import Player
from .serializers import ScoreboardSerializer, \
                            RegisterSerializer, \
                            AccountUpdateSerializer, \
                            AccountGetSerializer
from rest_framework.permissions import IsAuthenticated

class   ScoreboardViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all().order_by('score')
    serializer_class    = ScoreboardSerializer
    http_method_names   = ['get', ]

class   RegisterViewSet(viewsets.ModelViewSet):
    http_method_names   = ['post', ]
    serializer_class    = RegisterSerializer

class   AccountGetView(views.APIView):
    http_method_names   = ['get']
    authentication_classes = [TokenAuthentication]
    permission_classes  = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        player = self.request.user.player
        serializer = AccountGetSerializer(player)
        return Response(serializer.data, status=status.HTTP_200_OK)

class   AccountUpdateView(views.APIView):
    http_method_names   = ['update']
    authentication_classes = [TokenAuthentication]
    permission_classes  = [IsAuthenticated]

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = AccountUpdateSerializer(data=request.data)
        if serializer.is_valid() :
            resp = {}
            pwd = serializer.validated_data.get('password')
            if self.object.check_password(pwd) == False:
                return Response({'error' : 'Wrong password.'},
                                status=status.HTTP_400_BAD_REQUEST)
            new_pwd = serializer.validated_data.get('new_password', None)
            if not new_pwd is None:
                self.object.set_password(new_pwd)
                resp['password'] = 'Successfuly updated.'
            new_username = serializer.validated_data.get('username', None)
            if not new_username is None :
                self.object.username = new_username
                resp['username'] = 'Successfuly updated.'
            self.object.save()
            return Response(resp, status=200)
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)