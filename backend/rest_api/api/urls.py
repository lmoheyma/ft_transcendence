from rest_framework import routers
from .views import ScoreboardViewSet, RegisterViewSet, UpdateViewSet

router = routers.DefaultRouter()
router.register('scoreboard', ScoreboardViewSet, basename='scoreboard')
router.register('account/register', RegisterViewSet, basename='register')
router.register('account/update', UpdateViewSet, basename='update')