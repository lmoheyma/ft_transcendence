from .views import      CreateTournamentView, \
                        JoinTournamentView, \
                        StartTournamentView, \
                        TournamentInfo, \
                        MatchmakingView
from django.urls import path, include
from django.contrib import admin

urlpatterns = [
    # Tournament views
    path('tournament/create', CreateTournamentView.as_view()),
    path('tournament/join', JoinTournamentView.as_view()),
    path('tournament/start', StartTournamentView.as_view()),
    path('tournament/info', TournamentInfo.as_view()),
    # Account management
    path('find_match/', MatchmakingView.as_view()),
]