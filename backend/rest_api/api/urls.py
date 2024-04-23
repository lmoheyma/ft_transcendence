from rest_framework import routers
from .views import ScoreboardViewSet, RegisterViewSet, AccountUpdateView

router = routers.DefaultRouter()
router.register('scoreboard', ScoreboardViewSet, basename='scoreboard')
router.register('register', RegisterViewSet, basename='register')
router.register('account/update', AccountUpdateView, basename='update')