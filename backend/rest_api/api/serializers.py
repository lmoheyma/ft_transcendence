from rest_framework import serializers
import rest_framework.validators as validators
from .models import Player, User
from django.contrib.auth.password_validation import validate_password

class ScoreboardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    class Meta:
        model = Player
        fields = [
                'username',
                'avatar', 
                'games_no', 
                'wins', 
                'losses'
                ]

class AccountGetSerializer(serializers.ModelSerializer):
    username    = serializers.CharField(source="user.username", read_only=True)
    email       = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Player
        fields = [
                'email',
                'username',
                'avatar', 
                'games_no', 
                'wins', 
                'losses'
                ]

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
        fields = ['username',
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