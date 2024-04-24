
import { initializeGameData } from './handle_pong.js';

function handleEventsRemote() {
	var socket = new WebSocket("ws://localhost:8000/room/pong/");

	socket.onopen = function(e) {
		console.log("Connected");
		alert("Connected");
	};
	
	socket.onmessage = function (event) {
		alert(`[message] Data received from server: ${event.data}`);
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

// initializeGameData();
// startGame();

export function initRemote() {
	initializeGameData();
}