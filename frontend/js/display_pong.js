import { Game } from './handle_pong.js';
import { Display } from './handle_pong.js';
import { Player1 } from './handle_pong.js';
import { Player2 } from './handle_pong.js';
import { Ball } from './handle_pong.js';

console.log("hello");
function updateDisplay() {
	Display.border_space = Game.border_space * Game.canvas.height / Game.gameY;
	Display.border_size = Display.border_space / 2;

	Display.player1_pos_Y = Player1.pos_Y * Game.canvas.height / Game.gameY;
	Display.player2_pos_Y = Player2.pos_Y * Game.canvas.height / Game.gameY;
	Display.player_height = Game.player_height * Game.canvas.height / Game.gameY;
	Display.player_width = Game.player_width * Game.canvas.height / Game.gameY;

	Display.ball_pos_X = Ball.pos_X * Game.canvas.width / Game.gameX;
	Display.ball_pos_Y = Ball.pos_Y * Game.canvas.height / Game.gameY;
	Display.ball_size = Ball.size * Game.canvas.height / Game.gameY;
	console.log(Display);
}
    
export function drawAll() {
	updateDisplay();
	Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

	Game.ctx.fillStyle = "#000000";
	Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

	Game.ctx.fillStyle = "#FFFFFF";

	Game.ctx.fillRect(Display.border_space, Display.border_space, Game.canvas.width - (2 * Display.border_space), Display.border_size);
	Game.ctx.fillRect(Display.border_space, Game.canvas.height - (2 * Display.border_space - Display.border_size), Game.canvas.width - (2 * Display.border_space), Display.border_size);
	Game.ctx.fillRect(Display.border_space, Display.border_space, Display.border_size, Game.canvas.height - (2 * Display.border_space));
	Game.ctx.fillRect(Game.canvas.width - (2 * Display.border_space - Display.border_size), Display.border_space, Display.border_size, Game.canvas.height - (2 * Display.border_space));

	Game.ctx.fillRect(2 * Display.border_space + Display.border_size, Display.player1_pos_Y - (Display.player_height / 2), Display.player_width, Display.player_height);

	Game.ctx.fillRect(Game.canvas.width - (3 * Display.border_space + Display.border_size), Display.player2_pos_Y - (Display.player_height / 2), Display.player_width, Display.player_height);

	Game.ctx.fillRect(Display.ball_pos_X - (Display.ball_size / 2), Display.ball_pos_Y - (Display.ball_size / 2), Display.ball_size, Display.ball_size);

	Game.ctx.beginPath();
	Game.ctx.setLineDash([20, 10]);
	Game.ctx.moveTo((Game.canvas.width / 2), Game.canvas.height - (Display.border_space * 2));
	Game.ctx.lineTo((Game.canvas.width / 2), Display.border_space * 2);
	Game.ctx.lineWidth = Game.canvas.height / 120;
	Game.ctx.strokeStyle = '#ffffff';
	Game.ctx.stroke();

	Game.ctx.font = `${Game.canvas.height / 6}px Verdana`;
	Game.ctx.textAlign = 'center';

	Game.ctx.fillText(
		Player1.score.toString(),
		(Game.canvas.width / 2) - Game.canvas.height / 12,
		Game.canvas.height / 6 + Display.border_space
	);

	Game.ctx.fillText(
		Player2.score.toString(),
		(Game.canvas.width / 2) + Game.canvas.height / 12,
		Game.canvas.height / 6 + Display.border_space
	);

}