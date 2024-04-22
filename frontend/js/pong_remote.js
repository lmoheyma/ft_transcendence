
handleEventsRemote = function () {

	var socket = new WebSocket("wss://bess-f2r3s1:8888");

	socket.onopen = function(e) {
		otherPlayerConnected();
	};
	
	socket.onmessage = function (event) {
		alert(`[message] Data received from server: ${event.data}`);
	  };

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

otherPlayerConnected = function() {
	initializeGameData();
	startGame();
}