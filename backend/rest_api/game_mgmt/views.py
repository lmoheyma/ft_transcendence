from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, views, status, mixins
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from .models import Tournament, \
                    TournamentParticipant, \
                    TournamentGame, \
                    Game
from .serializers import TournamentSerializer

def     fetch_tournament(request):
    code = request.query_params.get('code', None)
    if code == None or len(code) != 14:
        return None
    try :
        tournament      = Tournament.objects.get(code=code)
    except :
        tournament      = None
    return tournament

class   CreateTournamentView(views.APIView):
    permission_classes  = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    http_method_names   = ['get',]

    def get(self, request, *args, **kwargs):
        tournament = Tournament()
        creator_participant     = TournamentParticipant(player=request.user.player, tournament=tournament)
        tournament.player_no    += 1
        tournament.creator      = request.user.player
        tournament.save()
        creator_participant.save()
        return Response({
                            'success' : 'Tournamenent created.', 
                            'code' : tournament.code
                        },
                        status=status.HTTP_200_OK)

class   JoinTournamentView(views.APIView):
    permission_classes  = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    http_method_names   = ['get',]

    def get(self, request, *args, **kwargs):
        tournament = fetch_tournament(request=request)
        if tournament == None :
            return Response({'error' : 'Invalid tournament code'},
                            status=status.HTTP_400_BAD_REQUEST)
        if tournament.is_started == True :
            return Response({'error' : 'Tournament has already started',
                             'code' : tournament.code},
                            status=status.HTTP_200_OK)
        if (self.request.user.player in [i.player for i in tournament.participants.all()]):
            return Response({'error': 'Already joined tournament',
                             'code' : tournament.code},
                            status=status.HTTP_200_OK)
        particant = TournamentParticipant(tournament=tournament,
                                            player=self.request.user.player)
        tournament.player_no += 1
        particant.save()
        tournament.save()
        return Response({'success' : 'Successfully joined tournament',
                         'code': tournament.code})

from collections import deque

class   StartTournamentView(views.APIView):
    permission_classes  = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    http_method_names   = ['get',]

    def autogen_matches(self):
        if self.tournament.player_no % 2 == 1 :
            is_odd = 1
            N = (self.tournament.player_no + 1) // 2
        else :
            is_odd = 0
            N = self.tournament.player_no // 2
        participants    = list(self.tournament.participants.all())
        round           = deque([i for i in range(1, len(participants) + is_odd)])
        for j in range(len(participants) + is_odd - 1):
            round.appendleft(0)
            for i in range(N):
                if is_odd \
                    and round[i] == self.tournament.player_no \
                    or round[i+N] == self.tournament.player_no :
                    continue
                game = Game()
                game.is_tournament = True
                tour_game = TournamentGame(tournament=self.tournament,
                                            game=game,
                                            participant1=participants[round[i]].player,
                                            participant2=participants[round[i+N]].player,
                                            round_no=j)
                game.save()
                tour_game.save()
            round.popleft()
            round.rotate(1)

    def get(self, request, *args, **kwargs):
        self.tournament = fetch_tournament(request)
        if self.tournament == None :
            return Response({'error' : 'Invalid tournament code'},
                            status=status.HTTP_400_BAD_REQUEST)
        if self.tournament.is_started == True :
            return Response({'error' : 'Can\'t start because tournament has already started'},
                            status=status.HTTP_400_BAD_REQUEST)
        if self.tournament.player_no < 2 :
            return Response({'error' : 'Not enough players (player_count > 2)'},
                            status=status.HTTP_400_BAD_REQUEST)
        self.autogen_matches()
        self.tournament.is_started = True
        self.tournament.save()
        return Response({'success' : 'Tournament has been started'},
                            status=status.HTTP_200_OK)

class   TournamentInfo(views.APIView):
    permission_classes  = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    http_method_names   = ['get',]

    def get(self, request,*args, **kwargs):
        self.tournament = fetch_tournament(request)
        if self.tournament == None :
            return Response({'error' : 'Invalid tournament code'},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer = TournamentSerializer(self.tournament, context={'player' : self.request.user.player})
        return Response(serializer.data,
                        status=status.HTTP_200_OK)

class   MatchmakingView(views.APIView):
    permission_classes  = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    http_method_names   = ['get',]

    def get(self, request,*args, **kwargs):
        games = list(Game.objects.filter((Q(player2=None) | Q(player1=None)) & Q(is_finished=False) & Q(is_tournament=False)))
        if (len(games) > 0) :
            ret = games[0]
        else :
            ret = Game()
            ret.save()
        return Response({'name' : ret.name}, status=status.HTTP_200_OK)
