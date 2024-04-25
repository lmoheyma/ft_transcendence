from rest_framework import routers
from .views import ScoreboardViewSet, RegisterViewSet, PlayerProfileView

router = routers.DefaultRouter()
router.register('scoreboard', ScoreboardViewSet, basename='scoreboard')
router.register('register', RegisterViewSet, basename='register')
router.register('profiles', PlayerProfileView, basename='profiles')