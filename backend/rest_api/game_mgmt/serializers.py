from django.db.models import Q
from acc_mgmt.models import Player, \
                            User, \
                            FriendInvite
from game_mgmt.models import Game, \
                             TournamentGame, \
                             TournamentParticipant, \
                             Tournament

from rest_framework import serializers
import rest_framework.validators as validators

class   GameSerializer(serializers.ModelSerializer):
    player1_username = serializers.SerializerMethodField()
    player2_username = serializers.SerializerMethodField()

    class Meta:
        model   = Game
        fields  = [
                'player1_username',
                'player2_username',
                'score_player1',
                'score_player2',
                'created_on',
                'nb_bounces',
                'game_duration'
                ]

    def get_player1_username(self, obj):
        return None if obj.player1 == None else obj.player1.user.username
    
    def get_player2_username(self, obj):
        return None if obj.player2 == None else obj.player2.user.username

class   TournamentGameSerializer(serializers.ModelSerializer):
    code    = serializers.CharField(source='game.name')
    p1      = serializers.CharField(source='participant1.user.username')
    p2      = serializers.CharField(source='participant2.user.username')

    class Meta :
        model   = TournamentGame
        fields = [
                'round_no',
                'code',
                'p1',
                'p2',
                ]

    def get_game_code(self, obj):
        pass

class   TournamentParticipantSerializer(serializers.ModelSerializer):
    username    = serializers.CharField(source="user.username", read_only=True)
    avatar      = serializers.CharField(source='user.avatar', read_only=True)
    score       = serializers.SerializerMethodField()

    class Meta:
        model = TournamentParticipant
        fields = [
                'avatar',
                'username',
                'score',
                ]

    def get_score(self, obj):
        tournament      = self.context.get('tournament')
        player          = obj
        player_games    = [ i.game for i in tournament.games.all() ]
        S               = 0
        for i in player_games :
            if i.player1 == player :
                S += i.score_player1
            if i.player2 == player :
                S += i.score_player2
        return S

def get_tournament_player_games(tournament, player):
    return tournament.games.all().filter(Q(game__is_finished=False) \
                                                 & (Q(participant1=player)
                                                    | Q(participant2=player)))

class   TournamentSerializer(serializers.ModelSerializer):
    participants    = serializers.SerializerMethodField()
    games           = serializers.SerializerMethodField()
    ismod           = serializers.SerializerMethodField()

    class Meta:
        model   = Tournament
        fields = [
                'participants',
                'games',
                'is_started',
                'is_finished',
                'ismod'
                ]

    def get_participants(self, obj):
        participants    = obj.participants.all().order_by('score')
        return TournamentParticipantSerializer([i.player for i in participants],
                                                context={
                                                    'tournament' : obj,
                                                    'player' : self.context.get('player', None)
                                                }, many=True).data

    def get_games(self, obj):
        games           = obj.games.all().filter(Q(game__is_finished=False) \
                                                 & (Q(participant1=self.context.get('player', None))
                                                    | Q(participant2=self.context.get('player', None))))
        return TournamentGameSerializer([i for i in games], many=True).data
    
    def get_ismod(self , obj):
        return obj.creator == self.context.get('player', None)