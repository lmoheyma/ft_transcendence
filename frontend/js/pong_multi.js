import { Player1 } from './handle_pong.js';
import { Player2 } from './handle_pong.js';
import { Game } from './handle_pong.js';
import { Directions } from './handle_pong.js';

export function handleEventsPongMultiplayer() {
	document.addEventListener('keydown', (event) => {
		if (event.key === "w" && Game.is_playing)
			Player1.dir = Directions.UP;
		if (event.key === "ArrowUp" && Game.is_playing)
			Player2.dir = Directions.UP;
		if (event.key === "s" && Game.is_playing)
			Player1.dir = Directions.DOWN;
		if (event.key === "ArrowDown" && Game.is_playing)
			Player2.dir = Directions.DOWN;
	});
	document.addEventListener('keyup', (event) => {
		if (event.key === "w" && Player1.dir === Directions.UP)
			Player1.dir = Directions.NOTHING;
		if (event.key === "s" && Player1.dir === Directions.DOWN)
				Player1.dir = Directions.NOTHING;
		if (event.key === "ArrowUp" && Player2.dir === Directions.UP)
			Player2.dir = Directions.NOTHING;
		if (event.key === "ArrowDown" && Player2.dir === Directions.DOWN)
			Player2.dir = Directions.NOTHING;
	});
}