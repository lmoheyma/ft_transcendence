from channels.middleware import BaseMiddleware

class GameStats:

    def __init__(self) -> None:
        self.no_players     = 0
        self.stat_tracker   = {
            'player1_score' : 0,
            'player2_score' : 0,
            'nb_bounces' : 0,
        }
        self.is_finished = False

class   GameMiddleware(BaseMiddleware):

    def __init__(self, inner):
        self.games = {}
        super().__init__(inner)

    def check_path(self, scope):
        path = scope["path"].split('/')
        if len(path) == 5 \
            and path[1] == 'ws' \
            and path[2] == 'room' :
            return path[3]
        return None

    def __call__(self, scope, receive, send):
        room_name = self.check_path(scope)
        if room_name != None :
            if room_name not in self.games :
                self.games[room_name] = GameStats()
            scope["game"] = self.games[room_name]
        return self.inner(scope, receive, send)