
handleEventsRemoteP1 = function () {
	var socket = new WebSocket(`ws://localhost:8000/ws/room/pong/1`);
	console.log(1);

	socket.onopen = function(e) {
		console.log("Connected");
		alert("Connected");
		var test;
		
		setInterval(() => {
			test = {
				"type" : "host",
				"player1_pos_Y": Player1.pos_Y,
				"player1_score": Player1.score,
				"player2_pos_Y" : Player2.pos_Y,
				"player2_score" : Player2.score,
				"ball_pos_X" : Ball.pos_X,
				"ball_pos_Y" : Ball.pos_Y,
				"ball_angle" : Ball.angle,
				"ball_speed" : Ball.speed
			};
			socket.send(JSON.stringify(test));
		}, 10);
	};
	
	socket.onmessage = function (event) {
		console.log(`[message] Data received from server: ${event.data}`);
		var msg = JSON.parse(event.data);
		var data = JSON.parse(msg.message);
		if (data.type === "guest")
		{
			Player2.dir = data.player2_dir;
			connectedPlayers = data.connected_clients;
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
}


handleEventsRemoteP2 = function () {
	var socket = new WebSocket(`ws://localhost:8000/ws/room/pong/2`);
	console.log(2);
	type = "Guest";

	socket.onopen = function(e) {
		console.log("Connected");
		alert("Connected");
		var test;
		
		setInterval(() => {
			test = {
				"type" : "guest",
				"player2_dir": Player2.dir,
			};
			socket.send(JSON.stringify(test));
		}, 10);
	};
	
	socket.onmessage = function (event) {
		console.log(`[message] Data received from server: ${event.data}`);
		var msg = JSON.parse(event.data);
		var data = JSON.parse(msg.message);
		if (data.type === "host")
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
}

waitOtherPlayerConnected = function() {
	// while (connectedPlayers != 2)
	// {
	// 	setTimeout(() => {
			
	// 	}, 10);
	// }
}