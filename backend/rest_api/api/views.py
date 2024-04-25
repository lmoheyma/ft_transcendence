from rest_framework import viewsets, views, status, mixins
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from .models import Player
from .serializers import ScoreboardSerializer, \
                            RegisterSerializer, \
                            AccountUpdateSerializer, \
                            AccountGetSerializer, \
                            PlayerProfileSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FileUploadParser
from django.core.files.uploadedfile import InMemoryUploadedFile

import io, os
from PIL import Image
from hashlib import md5

class   PlayerProfileView(mixins.RetrieveModelMixin, 
                          viewsets.GenericViewSet):
    queryset            = Player.objects.all().order_by('score')
    serializer_class    = PlayerProfileSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes  = [IsAuthenticated]
    http_method_names   = ['get', ]

class   ScoreboardViewSet(mixins.ListModelMixin,
                          viewsets.GenericViewSet):
    queryset            = Player.objects.all().order_by('score')
    serializer_class    = ScoreboardSerializer
    http_method_names   = ['get', ]

class   RegisterViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
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

class   AccountGetView(views.APIView):
    http_method_names   = ['get']
    authentication_classes = [TokenAuthentication]
    permission_classes  = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        player = self.request.user.player
        serializer = AccountGetSerializer(player)
        return Response(serializer.data, status=status.HTTP_200_OK)

class   LogoutView(views.APIView):
    http_method_names   = ['get']
    authentication_classes = [TokenAuthentication]
    permission_classes  = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try :
            request.user.auth_token.delete()
        except :
            pass
        return Response({'success' : 'Logged out'}, status=status.HTTP_200_OK)

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
            new_email = serializer.validated_data.get('email', None)
            if not new_email is None :
                self.object.email = new_email
                resp['email'] = 'Successfuly updated.'
            self.object.save()
            return Response(resp, status=200)
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)
    
class   AccountAvatarUpload(views.APIView):
    parser_classes = (FileUploadParser, )
    permission_classes  = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_object(self, queryset=None):
        return self.request.user

    
    def randfilename(self):
        m = md5()
        m.update(os.urandom(32))
        return m.hexdigest() + '.png'

    def pil_to_inmem(self, pil_img):
        thumb_io = io.BytesIO()
        pil_img.save(thumb_io, format='png')
        return InMemoryUploadedFile(thumb_io,
                                    None, 
                                    self.randfilename(),
                                    'image/png',
                                    thumb_io.tell(), None)

    def put(self, request, format=None):
        try :
            file_obj = request.data['file']
            img = Image.open(file_obj)
        except :
            return Response({"error" : "File error"},
                        status=status.HTTP_400_BAD_REQUEST)
        if img.size[0] < 128 or img.size[1] < 128 :
            return Response({"error" : "Invalid image size"},
                        status=status.HTTP_400_BAD_REQUEST)
        player = self.request.user.player
        player.avatar = self.pil_to_inmem(img.resize((128, 128)))
        player.save()
        return Response(status=204)
