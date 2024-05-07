import { Player1, Player2, Game, Ball, Directions, changeDisplayButtons } from './handle_pong.js';
import { drawAll } from './display_pong.js';

var interval;


export function moveAiListener(event) {
	if (event.key === "w" && Game.is_playing)
		Player1.dir = Directions.UP;
	if (event.key === "s" && Game.is_playing)
		Player1.dir = Directions.DOWN;
}

export function stopMoveAiListener(event) {
	if (event.key === "w" && Player1.dir === Directions.UP)
		Player1.dir = Directions.NOTHING;
	if (event.key === "s" && Player1.dir === Directions.DOWN)
			Player1.dir = Directions.NOTHING;
}

export function leavePongAi(event) {
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

export function handleEventsPongAi() {

	interval = setInterval(() => {
		if (Player2.pos_Y < Ball.pos_Y)
			Player2.dir = Directions.DOWN;
		else if (Player2.pos_Y > Ball.pos_Y)
			Player2.dir = Directions.UP;
		else
			Player2.dir = Directions.NOTHING;
	}, 200);

	document.addEventListener('keydown', moveAiListener);
	document.addEventListener('keyup', stopMoveAiListener);
	document.addEventListener('click', leavePongAi);
}