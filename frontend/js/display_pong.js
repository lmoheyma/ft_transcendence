import { Game, Display, Player1, Player2, Ball } from './handle_pong.js';
import { waitOtherPlayer } from './pong_remote.js'

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
}

export function drawAll() {
	updateDisplay();
	Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
	document.getElementById('score-left').style.color = '#FFFAF0';
	document.getElementById('score-right').style.color = '#FFFAF0';

	// Game.ctx.fillStyle = "#000000";
	// Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

	// Game.ctx.fillStyle = "rgba(0, 0, 0, 1)";

	// Game.ctx.fillRect(Display.border_space + 10, Game.canvas.height - (2 * Display.border_space - Display.border_size) + 10, Game.canvas.width - (2 * Display.border_space), Display.border_size);
	// Game.ctx.fillRect(Game.canvas.width - (2 * Display.border_space - Display.border_size) + 10, Display.border_space + 10, Display.border_size, Game.canvas.height - (2 * Display.border_space));

	// Game.ctx.fillStyle = "rgba(255, 255, 255, 1)";

	// Game.ctx.fillRect(Display.border_space, Display.border_space, Game.canvas.width - (2 * Display.border_space), Display.border_size);
	// Game.ctx.fillRect(Display.border_space, Game.canvas.height - (2 * Display.border_space - Display.border_size), Game.canvas.width - (2 * Display.border_space), Display.border_size);
	// Game.ctx.fillRect(Display.border_space, Display.border_space, Display.border_size, Game.canvas.height - (2 * Display.border_space));
	// Game.ctx.fillRect(Game.canvas.width - (2 * Display.border_space - Display.border_size), Display.border_space, Display.border_size, Game.canvas.height - (2 * Display.border_space));

	var canvasWidth = Game.canvas.width;
	var canvasHeight = Game.canvas.height;
	var radius = 20;
	var borderWidth = 7;

	Game.ctx.beginPath();
	Game.ctx.setLineDash([]);
    Game.ctx.moveTo(radius + borderWidth, borderWidth);
    Game.ctx.lineTo(canvasWidth - radius - borderWidth, borderWidth);
    Game.ctx.quadraticCurveTo(canvasWidth - borderWidth, borderWidth, canvasWidth - borderWidth, radius + borderWidth);
    Game.ctx.lineTo(canvasWidth - borderWidth, canvasHeight - radius - borderWidth);
    Game.ctx.quadraticCurveTo(canvasWidth - borderWidth, canvasHeight - borderWidth, canvasWidth - radius - borderWidth, canvasHeight - borderWidth);
    Game.ctx.lineTo(radius + borderWidth, canvasHeight - borderWidth);
    Game.ctx.quadraticCurveTo(borderWidth, canvasHeight - borderWidth, borderWidth, canvasHeight - radius - borderWidth);
    Game.ctx.lineTo(borderWidth, radius + borderWidth);
    Game.ctx.quadraticCurveTo(borderWidth, borderWidth, radius + borderWidth, borderWidth);
    Game.ctx.closePath();

    Game.ctx.fillStyle = '#FFFAF0';
    Game.ctx.fill();

	Game.ctx.strokeStyle = '#272727';
    Game.ctx.lineWidth = borderWidth;
    Game.ctx.stroke();

	// Pad left
	Game.ctx.fillStyle = '#E23434';
	Game.ctx.fillRect(2 * Display.border_space + Display.border_size, Display.player1_pos_Y - (Display.player_height / 2), Display.player_width, Display.player_height);

	// Pad right
	Game.ctx.fillStyle = '#6CB4E7';
	Game.ctx.fillRect(Game.canvas.width - (3 * Display.border_space + Display.border_size), Display.player2_pos_Y - (Display.player_height / 2), Display.player_width, Display.player_height);

	// Ball
	Game.ctx.fillStyle = '#272727';
	Game.ctx.fillRect(Display.ball_pos_X - (Display.ball_size / 2), Display.ball_pos_Y - (Display.ball_size / 2), Display.ball_size, Display.ball_size);

	Game.ctx.beginPath();
	Game.ctx.setLineDash([20, 10]);
	Game.ctx.moveTo((Game.canvas.width / 2), Game.canvas.height - (Display.border_space * 2));
	Game.ctx.lineTo((Game.canvas.width / 2), Display.border_space * 2);
	Game.ctx.lineWidth = Game.canvas.height / 120;
	Game.ctx.strokeStyle = '#272727';
	Game.ctx.stroke();
	Game.ctx.closePath();

	Game.ctx.font = `${Game.canvas.height / 6}px Poppins, sans-serif`;
	Game.ctx.textAlign = 'center';

	document.getElementById('score-left').textContent = Player1.score.toString();
	document.getElementById('score-right').textContent = Player2.score.toString();

	if (!Game.is_playing && !waitOtherPlayer)
	{
		Game.ctx.font = `${Game.canvas.height / 10}px Poppins, sans-serif`;
		Game.ctx.setLineDash([]);
	
	
		// Game.ctx.fillStyle = "#FFFFFF";
		// Game.ctx.strokeStyle = "#000000";
		// Game.ctx.strokeText(
		// 	"Press the button to start",
		// 	(Game.canvas.width / 2),
		// 	Game.canvas.height / 1.25
		// );
		// Game.ctx.fillText(
		// 	"Press the button to start",
		// 	(Game.canvas.width / 2),
		// 	Game.canvas.height / 1.25
		// );
	}
	else if (!Game.is_playing && waitOtherPlayer)
	{
		Game.ctx.font = `${Game.canvas.height / 12}px Poppins, sans-serif`;
		Game.ctx.setLineDash([]);
	
	
		Game.ctx.fillStyle = "#FFFFFF";
		Game.ctx.strokeStyle = "#000000";
		Game.ctx.strokeText(
			"Waiting creation of matchmaking",
			(Game.canvas.width / 2),
			Game.canvas.height / 1.25
		);
		Game.ctx.fillText(
			"Waiting creation of matchmaking",
			(Game.canvas.width / 2),
			Game.canvas.height / 1.25
		);
	}
}