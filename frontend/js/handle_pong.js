const cgameY = 100;
const cgameX = 300;

var Directions = {
    NOTHING: 0,
    UP: 1,
    DOWN: 2,
    RIGHT: 3,
    LEFT: 4,
}

var GameMod = {
    MULTI: 0,
    REMOTE: 1,
    AI: 2,
}

var Game = {
	canvas: null,
	ctx: null,
	is_playing: false,
	gameOver: false,
	gameY: cgameY,
	gameX: cgameX,
	border_space: 3,
	border_size: 1.5,
	player_height: 18,
	player_width: 3,
	gamemod: 0,
}

var Player1 = {
	dir: 0,
	pos_Y: 50,
}

var Player2 = {
	dir: 0,
	pos_Y: 50,
}

var Ball = {
	pos_X: 150,
	pos_Y: 50,
	size: Game.border_space,
	speed: 1,
	angle: 0,
}

var Display = {
	border_space: 0,
	border_size: 0,
	player1_pos_Y: 0,
	player2_pos_Y: 0,
	player_height: 0,
	player_width: 0,
	ball_pos_X: 0,
	ball_pos_Y: 0,
	ball_size: 0,
}

handleEvents = function () {
	document.addEventListener('click', (event) => {
		if (!Game.is_playing)
		{
			switch (event.target.id) {
				case "multi-btn":
				{
					Game.is_playing = true;
					Game.gameOver = false;
					Game.gamemod = GameMod.MULTI;
					handleEventsMultiplayer();
					initializeGameData();
					startGame();
					break;
				}
				case "remote-btn":
				{
					Game.is_playing = true;
					Game.gameOver = false;
					Game.gamemod = GameMod.REMOTE;
					handleEventsRemote();
					waitOtherPlayerConnected();
					break;
				}
				default:
					break;
			}
		}
	});
	window.addEventListener("resize", (event) => {
		if (window.innerHeight < window.innerWidth)
		{
			Game.canvas.height = window.innerHeight - 200;
			Game.canvas.width = Game.canvas.height * 1.5;
		}
		else
		{
			Game.canvas.width = window.innerWidth;
			Game.canvas.height = Game.canvas.width * (2 / 3);
		}

		if (Game.canvas.width > 900)
			Game.canvas.width = 900;
		if (Game.canvas.height > 600)
			Game.canvas.height = 600;

		if (window.innerHeight < 300)
		{
			Game.canvas.height = 100;
			Game.canvas.width = 150;
		}
		
		if (Math.floor(Game.canvas.height * 1.5) != Game.canvas.width && Math.floor(Game.canvas.height * 1.5) + 1 != Game.canvas.width)
			console.log("error");

		drawAll();
	});

}

startGame = function () {
	calculatePoses();
	if (!Game.gameOver)
	{
		drawAll();
		requestAnimationFrame(startGame.bind(this)); 
	}
}

initialize = function () {
	Game.canvas = document.querySelector('canvas');
	Game.ctx = Game.canvas.getContext('2d');

	Game.canvas.height = 600;
	Game.canvas.width = 600 + 300;

	if (window.innerHeight < window.innerWidth)
	{
		Game.canvas.height = window.innerHeight - 200;
		Game.canvas.width = Game.canvas.height * 1.5;
	}
	else
	{
		Game.canvas.width = window.innerWidth;
		Game.canvas.height = Game.canvas.width * (2 / 3);
	}

	if (Game.canvas.width > 900)
		Game.canvas.width = 900;
	if (Game.canvas.height > 600)
		Game.canvas.height = 600;

	if (window.innerHeight < 300)
	{
		Game.canvas.height = 100;
		Game.canvas.width = 150;
	}

	if (Math.floor(Game.canvas.height * 1.5) != Game.canvas.width && Math.floor(Game.canvas.height * 1.5) + 1 != Game.canvas.width)
		console.log("error");

	initializeGameData();
	drawAll()

	Game.ctx.font = `${Game.canvas.height / 8}px Verdana`;
	Game.ctx.setLineDash([]);


	Game.ctx.fillStyle = "#FFFFFF";
	Game.ctx.strokeStyle = "#000000";
	Game.ctx.strokeText(
		"Press the button to start",
		(Game.canvas.width / 2),
		Game.canvas.height / 1.25
	);
	Game.ctx.fillText(
		"Press the button to start",
		(Game.canvas.width / 2),
		Game.canvas.height / 1.25
	);
}

initializeGameData = function () {

	Game.pos_X = 150;
	Game.pos_Y = 50;
	Game.size = Game.border_space;
	Game.speed = 1;
	Game.angle = 0;

	Player1.pos_Y = 50;
	Player2.pos_Y = 50;
	Player1.dir = Directions.NOTHING;
	Player2.dir = Directions.NOTHING;
	Player1.score = 0;
	Player2.score = 0;

	Ball.pos_X = 150;
	Ball.pos_Y = 50;
	Ball.size = Game.border_space;
	Ball.speed = 1;

	var randomNumber = Math.floor(Math.random() * 4);
	switch (randomNumber) {
		case 0:
		{
			Ball.dir_X = Directions.LEFT;
			Ball.dir_Y = Directions.UP;
			Ball.angle = 180;
			break;
		}
		case 1:
		{
			Ball.dir_X = Directions.LEFT;
			Ball.dir_Y = Directions.DOWN;
			Ball.angle = 180;
			break;
		}
		case 2:
		{
			Ball.dir_X = Directions.RIGHT;
			Ball.dir_Y = Directions.UP;
			Ball.angle = 0;
			break;
		}
		case 3:
		{
			Ball.dir_X = Directions.RIGHT;
			Ball.dir_Y = Directions.DOWN;
			Ball.angle = 0;
			break;
		}
	}
}

calculatePoses = function () {
	if (Player1.pos_Y > 15 && Player1.dir === Directions.UP)
		Player1.pos_Y -= 1;
	if (Player1.pos_Y < 85 && Player1.dir === Directions.DOWN)
		Player1.pos_Y += 1;
	if (Player2.pos_Y > 15 && Player2.dir === Directions.UP)
		Player2.pos_Y -= 1;
	if (Player2.pos_Y < 85 && Player2.dir === Directions.DOWN)
		Player2.pos_Y += 1;

	if (Ball.pos_Y <= 6) {
		Ball.dir_Y = Directions.DOWN;
		Ball.angle = 360 - Ball.angle;
	}
	if (Ball.pos_Y >= 94) {
		Ball.dir_Y = Directions.UP;
		Ball.angle = 360 - Ball.angle;
	}

	if (Ball.pos_X <= 24 && (Ball.pos_Y <= Player1.pos_Y + 9 && Ball.pos_Y >= Player1.pos_Y - 9)) {
		if (Ball.pos_Y - Player1.pos_Y < 0)
			Ball.dir_Y = Directions.UP;
		else if (Ball.pos_Y - Player1.pos_Y > 0)
			Ball.dir_Y = Directions.DOWN;
		Ball.dir_X = Directions.RIGHT;

		var side = Math.abs(Ball.pos_Y - Player1.pos_Y);
		if (side <= 1)
		{
			Ball.angle = 0;
			var randomNumber = Math.floor(Math.random() * 10);
			if (randomNumber < 5)
				Ball.angle -= randomNumber / 2;
			else
				Ball.angle += randomNumber / 2;
		}
		else
		{
			Ball.angle = side * 6.25;
			var randomNumber = Math.floor(Math.random() * 10);
			if (randomNumber < 5)
				Ball.angle -= randomNumber / 2;
			else
				Ball.angle += randomNumber / 2;

		}
		Ball.dir_Y == Directions.DOWN ? Ball.angle = 360 - Ball.angle : Ball.angle = Ball.angle;
		Ball.speed += 0.3;
	}
	if (Ball.pos_X >= 276 && (Ball.pos_Y <= Player2.pos_Y + 9 && Ball.pos_Y >= Player2.pos_Y - 9)) {
		if (Ball.pos_Y - Player2.pos_Y < 0)
			Ball.dir_Y = Directions.UP;
		else if (Ball.pos_Y - Player2.pos_Y > 0)
			Ball.dir_Y = Directions.DOWN;
		Ball.dir_X = Directions.LEFT;

		var side = Math.abs(Ball.pos_Y - Player2.pos_Y);
		if (side <= 1)
		{
			Ball.angle = 0;
			var randomNumber = Math.floor(Math.random() * 10);
			if (randomNumber < 5)
				Ball.angle -= randomNumber / 2;
			else
				Ball.angle += randomNumber / 2;
		}
		else
		{
			Ball.angle = side * 6.25;
			var randomNumber = Math.floor(Math.random() * 10);
			if (randomNumber < 5)
				Ball.angle -= randomNumber / 2;
			else
				Ball.angle += randomNumber / 2;

		}
		Ball.dir_Y == Directions.DOWN ? Ball.angle = 180 + Ball.angle : Ball.angle = 180 - Ball.angle;
		Ball.speed += 0.3;
	}

	if (Ball.pos_X <= 12)
	{
		pointWon(2);
		return ;
	}
	if (Ball.pos_X >= 288)
	{
		pointWon(1);
		return ;
	}

	var radAngle = -(Ball.angle * Math.PI / 180);
	Ball.pos_Y += Ball.speed * Math.sin(radAngle);
	Ball.pos_X += Ball.speed * Math.cos(radAngle);
}

pointWon = function (player) {
	var randomNumber = Math.floor(Math.random() * 2);
	if (player === 1)
	{
		Player1.score++;
		if (Player1.score > 2)
			gameWon(1);
		switch (randomNumber) {
			case 0:
			{
				Ball.dir_Y = Directions.UP;
				break;
			}
			case 1:
			{
				Ball.dir_Y = Directions.DOWN;
				break;
			}
		}
		Ball.dir_X = Directions.LEFT;
		Ball.angle = 0;
	}
	else
	{
		Player2.score++;
		if (Player2.score > 2)
			gameWon(2);
		switch (randomNumber) {
			case 0:
			{
				Ball.dir_Y = Directions.UP;
				break;
			}
			case 1:
			{
				Ball.dir_Y = Directions.DOWN;
				break;
			}
		}
		Ball.dir_X = Directions.RIGHT;
		Ball.angle = 180;
	}
	Player1.pos_Y = 50;
	Player2.pos_Y = 50;
	Player1.dir = Directions.NOTHING;
	Player2.dir = Directions.NOTHING;
	Ball.pos_X = 150;
	Ball.pos_Y = 50;
	Ball.speed = 1;
}

gameWon = function (player) {
	Player1.pos_Y = 50;
	Player2.pos_Y = 50;
	Player1.dir = Directions.NOTHING;
	Player2.dir = Directions.NOTHING;
	Ball.pos_X = 150;
	Ball.pos_Y = 50;
	drawAll();

	Game.ctx.font = `${Game.canvas.height / 8}px Verdana`;
	Game.ctx.setLineDash([]);


	Game.ctx.fillStyle = "#FFFFFF";
	Game.ctx.strokeStyle = "#000000";
	Game.ctx.strokeText(
		`Player ${player} has won the game`,
		(Game.canvas.width / 2),
		Game.canvas.height / 1.25
	);
	Game.ctx.fillText(
		`Player ${player} has won the game`,
		(Game.canvas.width / 2),
		Game.canvas.height / 1.25
	);
	Game.is_playing = false;
	Game.gameOver = true;
}

initialize();
handleEvents();