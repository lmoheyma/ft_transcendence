from rest_framework import serializers
import rest_framework.validators as validators
from .models import Player, User, Game, FriendInvite, Tournament
from django.contrib.auth.password_validation import validate_password

class   GameSerializer(serializers.ModelSerializer):
    class Meta:
        model   = Game
        fields  = [
                'player1',
                'player2',
                'score_player1',
                'score_player2',
                'created_on'
                ]

class   ScoreboardSerializer(serializers.ModelSerializer):
    username    = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model   = Player
        fields  = [
                'id',
                'username',
                'avatar',
                'score'
                ]

class   UserSerializer(serializers.ModelSerializer):
    class Meta :
        model = User
        fields = [
            'username'
        ]

class   PlayerProfileSerializer(serializers.ModelSerializer):
    username    = serializers.CharField(source="user.username", read_only=True)
    history     = serializers.SerializerMethodField()

    class Meta:
        model   = Player
        fields  = [
                'id',
                'username',
                'avatar',
                'games_no',
                'wins',
                'losses',
                'history',
                ]

    def get_history(self, obj):
        res = GameSerializer(obj.history1_set.all() | obj.history2_set.all(), many=True).data
        return res

class   AccountGetSerializer(serializers.ModelSerializer):
    username    = serializers.CharField(source="user.username", read_only=True)
    email       = serializers.CharField(source="user.email", read_only=True)
    history     = serializers.SerializerMethodField()

    class Meta:
        model   = Player
        fields  = [
                'id',
                'email',
                'username',
                'avatar',
                'games_no',
                'wins',
                'losses',
                'history'
                ]

    def get_history(self, obj):
        res = GameSerializer(obj.history1_set.all() | obj.history2_set.all(), many=True).data
        return res

class   AccountUpdateSerializer(serializers.Serializer):
    username        = serializers.CharField(validators=[
                                        validators.UniqueValidator(queryset=User.objects.all()),
                                       ],
                                        required=False)

    email           = serializers.EmailField(validators=[
                                        validators.UniqueValidator(queryset=User.objects.all()),
                                       ],
                                        required=False)
    password        = serializers.CharField(write_only=True,
                                        required=True)
    new_password    = serializers.CharField(write_only=True,
                                        validators=[validate_password],
                                        required=False)
    
    def validate(self, attrs):
        if 'new_password' in attrs and attrs['password'] == attrs['new_password'] :
            raise serializers.ValidationError("New password must be different from old password")
        return attrs

class   RegisterSerializer(serializers.ModelSerializer):
    email       = serializers.EmailField(required=True,
                                   validators=[
                                       validators.UniqueValidator(queryset=User.objects.all())
                                       ])
    password1   = serializers.CharField(write_only=True,
                                     required=True, validators=[validate_password])
    password2   = serializers.CharField(write_only=True,
                                      )

    class Meta:
        model = User
        fields = [
                  'username',
                  'email',
                  'password1',
                  'password2',
                  ]
        
    def validate(self, data):
        if data['password1'] != data['password2'] :
            raise serializers.ValidationError("Passwords must match")
        return data

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password1'])
        player = Player.objects.create(user=user)
        player.save()
        user.save()
        return user


class   FriendSerializer(serializers.ModelSerializer):
    username    = serializers.CharField(source="user.username", read_only=True)

    class Meta :
        model = Player
        fields  = [
                'id',
                'username',
                'avatar',
                'status',
                ]

class   FriendInviteSerializer(serializers.ModelSerializer):
    sender      = PlayerProfileSerializer(read_only=True)

    class Meta:
        model   = FriendInvite
        fields  = [
                'code',
                'sender',
                'created_on',
                ]

class   FriendReqSerializer(serializers.Serializer):
    id          = serializers.CharField(required=True)

    class Meta:
        fields = ['id', ]

class TournamentSerializer(serializers.ModelSerializer):
    participants    = serializers.SerializerMethodField()
    games           = serializers.SerializerMethodField()

    class Meta:
        model   = Tournament
        fields = [
                'participants',
                'games',
                'is_started'
                ]

    def get_participants(self, obj):
        participants    = obj.participants.all()
        return ScoreboardSerializer([i.player for i in participants], many=True).data

    def get_games(self, obj):
        games           = obj.games.all()
        return GameSerializer([i.game for i in games], many=True).data