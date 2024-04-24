var socket;
var interval;

handleEventsPongRemoteP1 = function () {
	socket = new WebSocket(`ws://localhost:8000/ws/room/pong/1`);
	console.log(1);

	socket.onopen = function(e) {
		console.log("Connected");
		alert("Connected");
		
		waitOtherPlayer = true;
		interval = setInterval(() => {
			var send_data = {
				"type" : "host",
				"request": "game",
				"player1_pos_Y": Player1.pos_Y,
				"player1_score": Player1.score,
				"player2_pos_Y" : Player2.pos_Y,
				"player2_score" : Player2.score,
				"ball_pos_X" : Ball.pos_X,
				"ball_pos_Y" : Ball.pos_Y,
				"ball_angle" : Ball.angle,
				"ball_speed" : Ball.speed
			};
			socket.send(JSON.stringify(send_data));
		}, 10);
		drawAll();
	};
	
	socket.onmessage = function (event) {
		console.log(`[message] Data received from server: ${event.data}`);
		var msg = JSON.parse(event.data);
		var data = JSON.parse(msg.message);
		if (data.type === "guest")
		{
			switch (data.request) {
				case "game":
				{
					Player2.dir = data.player2_dir;
					connectedPlayers = data.connected_clients;
					if (connectedPlayers == 2 && !Game.is_playing)
					{
						Game.is_playing = true;
						waitOtherPlayer = false;
						startGame();
					}
					break;
				}
				case "ff":
				{
					Player1.pos_Y = 50;
					Player2.pos_Y = 50;
					Player1.dir = Directions.NOTHING;
					Player2.dir = Directions.NOTHING;
					Player1.score = 0;
					Player2.score = 0;
					Ball.pos_X = 150;
					Ball.pos_Y = 50;
					Game.is_playing = false;
					Game.gameOver = true;
					drawAll();
					clearInterval(interval);
					socket.close();
					waitOtherPlayer = false;
					drawAll();
					alert('Victoire par forfait');
					break;
				}
				default:
				{
					alert("error in socket message");
					break;
				}
			}
		}
	};

	socket.onclose = function(event) {
		console.log('Connection died');
		alert('Connection died');
	}
	

	document.addEventListener('keydown', (event) => {
		if (event.key === "w" && Game.is_playing)
			Player1.dir = Directions.UP;
		if (event.key === "s" && Game.is_playing)
			Player1.dir = Directions.DOWN;
	})
	document.addEventListener('keyup', (event) => {
		if (event.key === "w" && Player1.dir === Directions.UP)
			Player1.dir = Directions.NOTHING;
		if (event.key === "s" && Player1.dir === Directions.DOWN)
				Player1.dir = Directions.NOTHING;
	})
	document.addEventListener('visibilitychange', function() {
		if (socket.readyState === WebSocket.OPEN) {
			if (Game.is_playing)
			{
				var send_data = {
					"type" : "host",
					"request": "ff",
					"wonPlayer": 2,
					"player1_score": Player1.score,
					"player2_score" : Player2.score,
				};
				socket.send(JSON.stringify(send_data));
				Player1.pos_Y = 50;
				Player2.pos_Y = 50;
				Player1.dir = Directions.NOTHING;
				Player2.dir = Directions.NOTHING;
				Player1.score = 0;
				Player2.score = 0;
				Ball.pos_X = 150;
				Ball.pos_Y = 50;
				Game.is_playing = false;
				Game.gameOver = true;
				drawAll();
			}
			clearInterval(interval);
			socket.close();
			waitOtherPlayer = false;
			drawAll();
			console.log('Forfait');
			alert('Forfait');
		}
	})
}


handleEventsPongRemoteP2 = function () {
	var socket = new WebSocket(`ws://localhost:8000/ws/room/pong/2`);
	console.log(2);
	type = "Guest";

	socket.onopen = function(e) {
		console.log("Connected");
		alert("Connected");
		
		waitOtherPlayer = true;
		interval = setInterval(() => {
			var send_data = {
				"type" : "guest",
				"request": "game",
				"player2_dir": Player2.dir,
			};
			socket.send(JSON.stringify(send_data));
		}, 10);
		drawAll();
	};
	
	socket.onmessage = function (event) {
		console.log(`[message] Data received from server: ${event.data}`);
		var msg = JSON.parse(event.data);
		var data = JSON.parse(msg.message);
		if (data.type === "host")
		{
			switch (data.request) {
				case "game":
				{
					Player1.pos_Y = data.player1_pos_Y;
					Player1.score = data.player1_score;
					Player2.pos_Y = data.player2_pos_Y;
					Player2.score = data.player2_score;
					Ball.pos_X = data.ball_pos_X;
					Ball.pos_Y = data.ball_pos_Y;
					Ball.angle = data.ball_angle;
					Ball.speed = data.ball_speed;
					connectedPlayers = data.connected_clients;
					if (connectedPlayers == 2 && !Game.is_playing)
					{
						Game.is_playing = true;
						waitOtherPlayer = false;
						startGame();
					}
					break;
				}
				case "win":
				{
					Player1.score = data.player1_score;
					Player2.score = data.player2_score;
					drawAll();
					gameWon(data.wonPlayer);
					break;
				}
				case "ff":
				{
					Player1.pos_Y = 50;
					Player2.pos_Y = 50;
					Player1.dir = Directions.NOTHING;
					Player2.dir = Directions.NOTHING;
					Player1.score = 0;
					Player2.score = 0;
					Ball.pos_X = 150;
					Ball.pos_Y = 50;
					Game.is_playing = false;
					Game.gameOver = true;
					drawAll();
					clearInterval(interval);
					socket.close();
					waitOtherPlayer = false;
					drawAll();
					alert('Victoire par forfait');
					break;
				}
				default:
				{
					alert("error in socket message");
					break;
				}
			}
		}

	};
	socket.onclose = function(event) {
		console.log('Connection died');
		alert('Connection died');
	}
	

	document.addEventListener('keydown', (event) => {
		if (event.key === "w" && Game.is_playing)
			Player2.dir = Directions.UP;
		if (event.key === "s" && Game.is_playing)
			Player2.dir = Directions.DOWN;
	})
	document.addEventListener('keyup', (event) => {
		if (event.key === "w" && Player2.dir === Directions.UP)
			Player2.dir = Directions.NOTHING;
		if (event.key === "s" && Player2.dir === Directions.DOWN)
				Player2.dir = Directions.NOTHING;
	})
	document.addEventListener('visibilitychange', function() {
		if (socket.readyState === WebSocket.OPEN) {
			if (Game.is_playing)
			{
				var send_data = {
					"type" : "guest",
					"request": "ff",
				};
				socket.send(JSON.stringify(send_data));
				Player1.pos_Y = 50;
				Player2.pos_Y = 50;
				Player1.dir = Directions.NOTHING;
				Player2.dir = Directions.NOTHING;
				Player1.score = 0;
				Player2.score = 0;
				Ball.pos_X = 150;
				Ball.pos_Y = 50;
				Game.is_playing = false;
				Game.gameOver = true;
				drawAll();
			}
			clearInterval(interval);
			socket.close();
			waitOtherPlayer = false;
			drawAll();
			alert('Forfait');
		}
	})
}

//refaire start menu