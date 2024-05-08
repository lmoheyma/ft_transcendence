// import { drawAll } from "./display_pong.js";
// import { handleEventsPongRemote, type } from "./pong_remote.js";
// import { handleEventsPongMultiplayer, moveMultiListener, stopMoveMultiListener, leavePongMulti } from "./pong_multi.js";

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
	border_size: 0.5,
	player_height: 18,
	player_width: 3,
	gamemod: 0,
}

var Player1 = {
	dir: 0,
	pos_Y: 50,
	score: 0,
}

var Player2 = {
	dir: 0,
	pos_Y: 50,
	score: 0,
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

var socket;


function changeDisplayButtons()
{
	const buttons = document.querySelectorAll('.game-display');
	buttons.forEach(button => {
		button.hidden = !button.hidden;
	});
}

function getCookie(name) {
    let cookies = document.cookie;
    let parts = cookies.split('; ');
    for (let i = 0; i < parts.length; i++) {
        let part = parts[i];
        let [cookieName, cookieValue] = part.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return "";
}

function computeCanvasSize()
{
	if (window.innerHeight * (4/3) < window.innerWidth)
		{
			Game.canvas.width = window.innerHeight * (4/3);
			Game.canvas.height = window.innerHeight * 0.9;
		}
		else
		{
			Game.canvas.width = window.innerWidth * 0.9;
			Game.canvas.height = window.innerWidth * (2/3);
		}
}

function handleEventsPong() {
	document.addEventListener('click', async (event) => {
		if (!Game.is_playing)
		{
			if (event.target.id == "multi-btn")
			{
				const choices = ['remote', 'multi', 'ai']
				const queryString = window.location.search;
				const mode = new URLSearchParams(queryString).get('mode');
				// var gamemodsButtons = document.querySelectorAll('input[name="gamemod"]');
				var thisGamemod = mode != null && choices.includes(mode) ? mode : 'multi';
				// for (let i = 0; i < gamemodsButtons.length; i++) {
				// 	if (gamemodsButtons[i].checked) {
				// 		thisGamemod = gamemodsButtons[i].value;
				// 		break;
				// 	}
				// }
				switch (thisGamemod) {
					case "multi":
					{
						Game.gameOver = false;
						Game.gamemod = GameMod.MULTI;
						handleEventsPongMultiplayer();
						initializeGameData();
						Game.is_playing = true;
						changeDisplayButtons();
						startGame(true);
						break;
					}
					case "remote":
					{
						Game.gameOver = false;
						Game.gamemod = GameMod.REMOTE;
						const code = new URLSearchParams(queryString).get('code');
						if (code == null)
						{
							const res = await fetch("https://localhost:8000/api/find_match/", {
								method: "GET",
								headers: {
								"Authorization" : "Token " + getCookie("Session"),
								}
							});
							const room = await res.json();
							socket = new WebSocket(`wss://localhost:8000/ws/room/${room.name}/${getCookie("Session")}`);
						}
						else
						{
							socket = new WebSocket(`wss://localhost:8000/ws/room/${code}/${getCookie("Session")}`);
						}
						handleEventsPongRemote();
						initializeGameData();
						break;
					}
					case "ai":
					{
						Game.gameOver = false;
						Game.gamemod = GameMod.AI;
						handleEventsPongAiplayer();
						initializeGameData();
						Game.is_playing = true;
						changeDisplayButtons();
						startGame(true);
						break;
					}
					default:
						break;
				}
			}
		}
	});
	window.addEventListener("resize", (event) => {
		computeCanvasSize()
		drawAll();
	});

}

function startGame(calculate) {
	if (calculate)
		calculatePoses();
	if (!Game.gameOver)
	{
		drawAll();
		requestAnimationFrame(startGame.bind(this, true)); 
	}
}

function initialize() {
	Game.canvas = document.querySelector('canvas');
	Game.ctx = Game.canvas.getContext('2d');

	computeCanvasSize()
	initializeGameData();
	drawAll()
}

function initializeGameData() {

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

function calculatePoses() {
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

function pointWon(player) {
	var randomNumber = Math.floor(Math.random() * 2);
	if (player === 1)
	{
		Player1.score++;
		if (Player1.score > 2)
		{
			if (Game.gamemod === GameMod.REMOTE)
			{
				var send_data = {
					"type" : "host",
					"request": "win",
					"wonPlayer": 1,
					"player1_score": Player1.score,
					"player2_score" : Player2.score,
				};
				socket.send(JSON.stringify(send_data));
			}
			gameWon(1);
		}
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
		{
			if (Game.gamemod === GameMod.REMOTE)
			{
				var send_data = {
					"type" : "host",
					"request": "win",
					"wonPlayer": 2,
					"player1_score": Player1.score,
					"player2_score" : Player2.score,
				};
				socket.send(JSON.stringify(send_data));
			}
			gameWon(2);
		}
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

function gameWon(player) {
	Player1.pos_Y = 50;
	Player2.pos_Y = 50;
	Player1.dir = Directions.NOTHING;
	Player2.dir = Directions.NOTHING;
	Ball.pos_X = 150;
	Ball.pos_Y = 50;
	drawAll();

	Game.ctx.font = `600 ${Game.canvas.height / 8}px Poppins, sans-serif`;
	Game.ctx.setLineDash([]);


	Game.ctx.fillStyle = "#272727";
	Game.ctx.strokeStyle = "#FFFAF0";
	Game.ctx.strokeText(
		`Player ${player} has won!`,
		(Game.canvas.width / 2),
		Game.canvas.height / 1.25
	);
	Game.ctx.fillText(
		`Player ${player} has won!`,
		(Game.canvas.width / 2),
		Game.canvas.height / 1.25
	);

	if (player == 2)
		document.getElementById('score-right').style.color = '#29cf16';
	else
		document.getElementById('score-left').style.color = '#29cf16';
	displayNavbar();
	Game.is_playing = false;
	changeDisplayButtons();
	Game.gameOver = true;
	if (Game.gamemod == GameMod.MULTI)
	{
		document.removeEventListener('keydown', moveMultiListener);
		document.removeEventListener('keyup', stopMoveMultiListener);
		document.removeEventListener('click', leavePongMulti);
	}
}

function initHandlePong() {
	initialize();
	handleEventsPong();
}