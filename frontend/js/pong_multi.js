import { Player1, Player2, Game, Ball, Directions, changeDisplayButtons } from './handle_pong.js';
import { drawAll } from './display_pong.js';

export function moveMultiListener(event) {
	if (event.key === "w" && Game.is_playing)
		Player1.dir = Directions.UP;
	if (event.key === "ArrowUp" && Game.is_playing)
		Player2.dir = Directions.UP;
	if (event.key === "s" && Game.is_playing)
		Player1.dir = Directions.DOWN;
	if (event.key === "ArrowDown" && Game.is_playing)
		Player2.dir = Directions.DOWN;
}

export function stopMoveMultiListener(event) {
	if (event.key === "w" && Player1.dir === Directions.UP)
		Player1.dir = Directions.NOTHING;
	if (event.key === "s" && Player1.dir === Directions.DOWN)
			Player1.dir = Directions.NOTHING;
	if (event.key === "ArrowUp" && Player2.dir === Directions.UP)
		Player2.dir = Directions.NOTHING;
	if (event.key === "ArrowDown" && Player2.dir === Directions.DOWN)
		Player2.dir = Directions.NOTHING;
}

export function leavePongMulti(event) {
	if (Game.is_playing)
	{
		if (event.target.id == "leave-match")
		{
			Player1.pos_Y = 50;
			Player2.pos_Y = 50;
			Player1.dir = Directions.NOTHING;
			Player2.dir = Directions.NOTHING;
			Ball.pos_X = 150;
			Ball.pos_Y = 50;
			Game.is_playing = false;
			Game.gameOver = true;
			changeDisplayButtons();
			drawAll();
		}
	}
}

export function handleEventsPongMultiplayer() {
	document.addEventListener('keydown', moveMultiListener);
	document.addEventListener('keyup', stopMoveMultiListener);
	document.addEventListener('click', leavePongMulti);
}