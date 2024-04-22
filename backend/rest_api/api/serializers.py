from rest_framework import serializers
import rest_framework.validators as validators
from .models import Player, User
from django.contrib.auth.password_validation import validate_password

class ScoreboardSerializer(serializers.HyperlinkedModelSerializer):
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = Player
        fields = [
                'url',
                'username',
                'avatar', 
                'games_no', 
                'wins', 
                'losses'
                ]
        
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True,
                                   validators=[
                                       validators.UniqueValidator(queryset=User.objects.all())
                                       ])
    password1 = serializers.CharField(write_only=True,
                                     required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True,
                                      )

    class Meta:
        model = User
        fields = ['username',
                  'email',
                  'password1',
                  'password2',
                  ]
    
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