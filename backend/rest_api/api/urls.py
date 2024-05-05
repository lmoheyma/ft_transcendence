from rest_framework import routers
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views

from .views import ScoreboardViewSet, \
                        RegisterViewSet, \
                        PlayerProfileView, \
                        AccountUpdateView, \
                        AccountGetView, \
                        LogoutView, \
                        AccountAvatarUpload, \
                        FriendInviteView, \
                        FriendListView, \
                        CreateTournamentView, \
                        JoinTournamentView, \
                        StartTournamentView, \
                        TournamentInfo, \
                        MatchmakingView

router = routers.DefaultRouter()
router.register('scoreboard', ScoreboardViewSet, basename='scoreboard')
router.register('register', RegisterViewSet, basename='register')
router.register('profiles', PlayerProfileView, basename='profiles')

urlpatterns = [
    # To remove before locking
    path('admin/', admin.site.urls),
    # Tournament views
    path('tournament/create', CreateTournamentView.as_view()),
    path('tournament/join', JoinTournamentView.as_view()),
    path('tournament/start', StartTournamentView.as_view()),
    path('tournament/info', TournamentInfo.as_view()),
    # Account management
    path('account/update', AccountUpdateView.as_view()),
    path('account/avatar_upload', AccountAvatarUpload.as_view()),
    path('account', AccountGetView.as_view()),
    # Friend management
    path('invites', FriendInviteView.as_view()),
    path('friends', FriendListView.as_view()),
    # Authentication
    path('logout', LogoutView.as_view()),
    path('', include(router.urls)),
    path('token-auth/', views.obtain_auth_token),
    path('find_match/', MatchmakingView.as_view())
]