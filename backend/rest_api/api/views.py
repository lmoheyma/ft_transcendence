from rest_framework import viewsets, views, status, mixins
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from .models import Player, FriendInvite, Friendship
from .serializers import ScoreboardSerializer, \
                            RegisterSerializer, \
                            AccountUpdateSerializer, \
                            AccountGetSerializer, \
                            PlayerProfileSerializer, \
                            FriendInviteSerializer, \
                            FriendReqSerializer, \
                            FriendSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FileUploadParser
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.contrib.auth.models import User

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
        len = min(pil_img.size[0], pil_img.size[1])
        cropped_img = pil_img.crop((0, 0, len, len))
        cropped_img.thumbnail((128,128))
        cropped_img.save(thumb_io, format='png')
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
        player.avatar = self.pil_to_inmem(img)
        player.save()
        return Response(status=204)

def     getAllFriendsAsUsers(user : Player):
    res = [i.friend2 for i in user.friends1_set.all()]
    res += [i.friend1 for i in user.friends2_set.all()]
    return res

def     getAllFriendships(user : Player):
    res = user.friends1_set.all() | user.friends2_set.all()
    return res

class   FriendListView(views.APIView):
    permission_classes  = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    http_method_names   = ['get', 'delete']

    def get(self, request, *args, **kwargs):
        friends = getAllFriendsAsUsers(request.user.player)
        serializer = FriendSerializer(friends, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        serializer = FriendReqSerializer(data=request.data)
        if serializer.is_valid() :
            id = serializer.validated_data.get('id')
            try :
                friendship_to_del = [i for i in getAllFriendships(request.user.player)
                                        if i.friend1.user.username == id or i.friend2.user.username == id][0]
                friendship_to_del.delete()
                return Response({'success' : 'Deleted friend'},
                        status=status.HTTP_200_OK)
            except :
                friendship_to_del = None
                return Response({'error' : 'Could not delete (Invalid ID).'},
                        status=status.HTTP_400_BAD_REQUEST)
        return Response({'error' : 'Could not delete.'},
                        status=status.HTTP_400_BAD_REQUEST)

class   FriendInviteView(views.APIView):
    permission_classes  = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    http_method_names   = ['get', 'post',]

    def get(self, request, *args, **kwargs):
        if 'accept' in request.query_params :
            invite_code = request.query_params['accept']
            try:
                invite      = FriendInvite.objects.get(code=invite_code)
            except :
                invite      = None
            if invite == None or invite.receiver != self.request.user.player :
                return Response({'error':'Invalid invite.'},
                                status=status.HTTP_400_BAD_REQUEST)
            friend = Friendship(friend1=self.request.user.player, friend2=invite.sender)
            invite.delete()
            friend.save()
            return Response({'success' : 'Invite accepted.'}, status=status.HTTP_200_OK)
        else :
            invites     = FriendInvite.objects.filter(receiver=self.request.user.player)
            serializer  = FriendInviteSerializer(invites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = FriendReqSerializer(data=request.data)
        if serializer.is_valid() :
            id = serializer.validated_data.get('id')
            try :
                target = User.objects.get(username=id).player
            except :
                target = None
            friends = getAllFriendsAsUsers(self.request.user.player)
            if target != None :
                if target in friends:
                    return Response({'error' : '📢 Already in your\r\nfriendlist.'},
                                    status=status.HTTP_400_BAD_REQUEST)
                if target == self.request.user.player :
                    return Response({'success' : '🤔 Aren\'t you already\r\nyour own friend ?'},
                                    status=status.HTTP_400_BAD_REQUEST)
                if next((i for i in self.request.user.player.sent_invites.all()
                            | self.request.user.player.received_invites.all() if i.sender == target or i.receiver), None) :
                    return Response({'success' : '📢 Friend invite already\r\nsent or received.'},
                                    status=status.HTTP_400_BAD_REQUEST)
                friendship = FriendInvite(receiver=target, sender=self.request.user.player)
                friendship.save()
                return Response({'success' : '✅ Friend request sent.'},
                                status=status.HTTP_200_OK)
        return Response({'error' : '⚠️  Bad friend request'},
                        status=status.HTTP_400_BAD_REQUEST)
