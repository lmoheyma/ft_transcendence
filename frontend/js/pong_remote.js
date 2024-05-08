
// import { socket, Game, Player1, Player2, Ball, startGame, Directions, gameWon, changeDisplayButtons } from './handle_pong.js';
// import { drawAll } from './display_pong.js';

var interval;
var waitOtherPlayer = false;
var type = "";
var adversaryType = "";
var connectedPlayers = 0;

function moveRemoteListener(event) {
	if (type && type === "host")
	{
		if (event.key === "w" && Game.is_playing)
			Player1.dir = Directions.UP;
		if (event.key === "s" && Game.is_playing)
			Player1.dir = Directions.DOWN;
	}
	else if (type && type === "guest")
	{
		if (event.key === "w" && Game.is_playing)
			Player2.dir = Directions.UP;
		if (event.key === "s" && Game.is_playing)
			Player2.dir = Directions.DOWN;
	}
}

function stopMoveRemoteListener(event) {
	if (type && type === "host")
	{
		if (event.key === "w" && Player1.dir === Directions.UP)
			Player1.dir = Directions.NOTHING;
		if (event.key === "s" && Player1.dir === Directions.DOWN)
				Player1.dir = Directions.NOTHING;
	}
	else if (type && type === "guest")
	{
		if (event.key === "w" && Player2.dir === Directions.UP)
			Player2.dir = Directions.NOTHING;
		if (event.key === "s" && Player2.dir === Directions.DOWN)
				Player2.dir = Directions.NOTHING;
	}
}

function updatePongView() {
	if (socket.readyState === WebSocket.OPEN) {
		if (Game.is_playing)
		{
			var send_data = {
				"type" : type,
				"request": "ff",
				"wonPlayer": type == "host" ? 2 : 1,
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
			changeDisplayButtons();
			Game.gameOver = true;
			drawAll();
		}
		clearInterval(interval);
		socket.close();
		waitOtherPlayer = false;
		type = "";
		adversaryType = "";
		drawAll();
		console.log('Forfait');
		alert('Forfait');
	}
}

function leavePongRemote(event) {
	if (Game.is_playing || waitOtherPlayer)
	{
		if (event.target.id == "leave-match")
		{
			if (Game.is_playing)
			{
				var send_data = {
					"type" : type,
					"request": "ff",
					"wonPlayer": type == "host" ? 2 : 1,
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
				Game.gameOver = true;
			}
			if (Game.is_playing || waitOtherPlayer)
			{
				clearInterval(interval);
				socket.close();
				Game.is_playing = false;
				changeDisplayButtons();
				waitOtherPlayer = false;
				type = "";
				adversaryType = "";
				drawAll();
			}
		}
	}
}

function handleEventsPongRemote() {

	socket.onopen = function(e) {
		console.log("Connected");
		alert("Connected");
		
		waitOtherPlayer = true;
		interval = setInterval(() => {
			if (type)
			{
				var send_data;
				if (type == "host")
				{
					send_data = {
						"type" : type,
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
				}
				else if (type == "guest")
				{
					send_data = {
						"type" : type,
						"request": "game",
						"player2_dir": Player2.dir,
					};
				}
				socket.send(JSON.stringify(send_data));
				// console.log("Msg send");
			}
		}, 10);
		drawAll();
	};
	
	socket.onmessage = function (event) {
		console.log(`[message] Data received from server: ${event.data}`);
		var msg = JSON.parse(event.data);
		var data = JSON.parse(msg.message);
		if (!type && data.type === "player")
		{
			type = data.you == 1 ? "host" : "guest";
			adversaryType = data.you == 1 ? "guest" : "host";
		}
		else if (type == "host" && data.type === adversaryType)
		{
			switch (data.request) {
				case "game":
				{
					Player2.dir = data.player2_dir;
					connectedPlayers = data.connected_clients;
					if (connectedPlayers == 2 && !Game.is_playing)
					{
						Game.is_playing = true;
						changeDisplayButtons();
						waitOtherPlayer = false;
						startGame(true);
					}
					break;
				}
				case "win":
				{
					clearInterval(interval);
					socket.close();
					waitOtherPlayer = false;
					Game.is_playing = false;
					changeDisplayButtons();
					Game.gameOver = true;
					type = "";
					adversaryType = "";
					window.top.postMessage('UPDATE', '*')
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
					changeDisplayButtons();
					Game.gameOver = true;
					drawAll();
					clearInterval(interval);
					socket.close();
					waitOtherPlayer = false;
					type = "";
					adversaryType = "";
					drawAll();
					window.top.postMessage('UPDATE', '*')
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
		else if (type == "guest" && data.type === adversaryType)
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
						changeDisplayButtons();
						waitOtherPlayer = false;
						startGame(false);
					}
					break;
				}
				case "win":
				{
					Player1.score = data.player1_score;
					Player2.score = data.player2_score;
					var send_data = {
						"type" : type,
						"request": "win",
						"wonPlayer": data.wonPlayer,
						"player1_score": data.player1_score,
						"player2_score" : data.player2_score,
					};
					gameWon(data.wonPlayer);
					waitOtherPlayer = false;
					Game.is_playing = false;
					changeDisplayButtons();
					Game.gameOver = true;
					type = "";
					adversaryType = "";
					socket.send(JSON.stringify(send_data));
					clearInterval(interval);
					socket.close();
					window.top.postMessage('UPDATE', '*')
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
					changeDisplayButtons();
					Game.gameOver = true;
					drawAll();
					clearInterval(interval);
					socket.close();
					waitOtherPlayer = false;
					type = "";
					adversaryType = "";
					drawAll();
					window.top.postMessage('UPDATE', '*')
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
	
	document.addEventListener('keydown', moveRemoteListener);
	document.addEventListener('keyup', stopMoveRemoteListener);
	document.addEventListener('visibilitychange', updatePongView)
	document.addEventListener('click', leavePongRemote);

	socket.onclose = function(event) {
		document.removeEventListener('keydown', moveRemoteListener);
		document.removeEventListener('keyup', stopMoveRemoteListener);
		document.removeEventListener('visibilitychange', updatePongView);
		document.removeEventListener('click', leavePongRemote);
		console.log('Connection died');
		alert('Connection died');
	}
}
