import { handleEventsTTTRemote, waitOtherPlayer, displayTurn } from "./tictactoe_remote.js";

export var TicTacToe = {
	canva: null,
	ctx: null,
	is_playing: false,
	cells: [],
	totalSize: 620,
	cellSize: 200,
	borderSize: 10,
	Display: {
		cellSize: 0,
		borderSize: 0,
	},
	is_playing: false,
	gameOver: false,
	gamemod: 0,
	playerTurn: 0,
	wonPlayer: -1,
}

export var GameMod = {
    MULTI: 0,
    REMOTE: 1,
    AI: 2,
}

export var socket;
export var eventListenersToDestroy = [];

// remote

function initializeTicTacToe() {
	TicTacToe.canvas = document.querySelector('canvas');
	TicTacToe.ctx = TicTacToe.canvas.getContext('2d');

	var totalSize;
	if (window.innerHeight < window.innerWidth)
	{
		totalSize = window.innerHeight - 400;
		TicTacToe.canvas.height = totalSize;
		TicTacToe.canvas.width = totalSize;
	}
	else
	{
		totalSize = window.innerWidth - 400;
		TicTacToe.canvas.height = totalSize;
		TicTacToe.canvas.width = totalSize;
	}

	if (TicTacToe.canvas.width > 600)
	{
		TicTacToe.canvas.height = 600;
		TicTacToe.canvas.width = 600;
	}

	if (window.innerHeight < 600 || window.innerWidth < 600)
	{
		TicTacToe.canvas.height = 200;
		TicTacToe.canvas.width = 200;
	}

	initializeTTTData();
	drawTicTacToe();
}

function initializeTTTData() {
	for (let i = 0; i < 3; i++)
	{
		TicTacToe.cells[i] = [];
		for (let j = 0; j < 3; j++)
			TicTacToe.cells[i][j] = 0;
	}

		
	var randomNumber = Math.floor(Math.random() * 2);
	if (randomNumber == 0)
		TicTacToe.playerTurn = 1;
	else
		TicTacToe.playerTurn = 2;
}

export function changeDisplayButtons()
{
	const buttons = document.querySelectorAll('.game-display');
	buttons.forEach(button => {
		button.hidden = !button.hidden;
	});
}


function handleEventsTicTacToe() {
	document.addEventListener('click', async (event) => {
		if (!TicTacToe.is_playing)
		{

			if (event.target.id == "multi-btn")
			{
				var gamemodsButtons = document.querySelectorAll('input[name="gamemod"]');
				var thisGamemod;
				for (let i = 0; i < gamemodsButtons.length; i++) {
					if (gamemodsButtons[i].checked) {
						thisGamemod = gamemodsButtons[i].value;
						break;
					}
				}
				switch (thisGamemod) {
					case "multi":
					{
						TicTacToe.gameOver = false;
						TicTacToe.gamemod = GameMod.MULTI;
						TicTacToe.is_playing = true;
						changeDisplayButtons();
						initializeTTTData();
						drawTicTacToe();
						handleEventsTTTMultiplayer();
						break;
					}
					case "remote":
					{
						TicTacToe.gameOver = false;
						TicTacToe.gamemod = GameMod.REMOTE;
						var req = await fetch('/api/find_match/', {
							method: "GET",
							headers: {
							"Authorization" : "Token " + getCookie("Session")
						}
						});
						var room = await req.json();
						console.log(room)
						socket = new WebSocket(`wss://${window.location.host}/ws/room/${room.name}/${getCookie("Session")}`);
						initializeTTTData();
						changeDisplayButtons();
						handleEventsTTTRemote();
						break;
					}
					default:
						break;
				}
			}
		}
	});
	window.addEventListener("resize", (event) => {
		var totalSize;

		if (window.innerHeight < window.innerWidth)
		{
			totalSize = window.innerHeight - 400;
			TicTacToe.canvas.height = totalSize;
			TicTacToe.canvas.width = totalSize;
		}
		else
		{
			totalSize = window.innerWidth - 400;
			TicTacToe.canvas.height = totalSize;
			TicTacToe.canvas.width = totalSize;
		}

		if (TicTacToe.canvas.width > 600)
		{
			TicTacToe.canvas.height = 600;
			TicTacToe.canvas.width = 600;
		}

		if (window.innerHeight < 600 || window.innerWidth < 600)
		{
			TicTacToe.canvas.height = 200;
			TicTacToe.canvas.width = 200;
		}

		drawTicTacToe();
	});

}

function updateDisplayTTT() {
	TicTacToe.Display.borderSize = TicTacToe.borderSize * TicTacToe.canvas.height / TicTacToe.totalSize;
	TicTacToe.Display.cellSize = TicTacToe.cellSize * TicTacToe.canvas.height / TicTacToe.totalSize;
}

export function drawTicTacToe() {
	updateDisplayTTT();
	TicTacToe.ctx.clearRect(0, 0, TicTacToe.canvas.width, TicTacToe.canvas.height);

	// TicTacToe.ctx.fillStyle = "#7b4397";
	TicTacToe.ctx.fillStyle = "#FFFAF0";
	TicTacToe.ctx.fillRect(0, 0, TicTacToe.canvas.width, TicTacToe.canvas.height);
	
	TicTacToe.ctx.fillStyle = "#272727";

	TicTacToe.ctx.fillRect(TicTacToe.Display.cellSize, 40, TicTacToe.Display.borderSize, TicTacToe.canvas.height - 80);
	TicTacToe.ctx.fillRect(TicTacToe.Display.cellSize * 2 + TicTacToe.Display.borderSize, 40, TicTacToe.Display.borderSize, TicTacToe.canvas.height - 80);
	TicTacToe.ctx.fillRect(40, TicTacToe.Display.cellSize, TicTacToe.canvas.width - 80, TicTacToe.Display.borderSize);
	TicTacToe.ctx.fillRect(40, TicTacToe.Display.cellSize * 2 + TicTacToe.Display.borderSize, TicTacToe.canvas.width - 80, TicTacToe.Display.borderSize);

	var x;
	var y;
	// TicTacToe.ctx.strokeStyle = "#601496";
	TicTacToe.ctx.lineWidth = TicTacToe.Display.cellSize / 10;
	
	for (let i = 0; i < 3; i++)
	{
		y = (TicTacToe.Display.cellSize * i) + (TicTacToe.Display.borderSize * i) + (TicTacToe.Display.cellSize / 2);
		for (let j = 0; j < 3; j++)
		{
			x = (TicTacToe.Display.cellSize * j) + (TicTacToe.Display.borderSize * j) + (TicTacToe.Display.cellSize / 2);
			if (TicTacToe.cells[i][j] == 1) {
				TicTacToe.ctx.strokeStyle = "#6CB4E7";
				drawO(x, y);
			}
			else if (TicTacToe.cells[i][j] == 2) {
				TicTacToe.ctx.strokeStyle = "#E23434";
				drawX(x, y);
			}
		}
	}

	TicTacToe.ctx.fillStyle = "#272727";
	TicTacToe.ctx.strokeStyle = "#FFFAF0";
	TicTacToe.ctx.textAlign = 'center';
	TicTacToe.ctx.lineWidth = 5;
	TicTacToe.ctx.font = `600 ${TicTacToe.canvas.height / 12}px Poppins, sans-serif`;
	
	if (!TicTacToe.is_playing && waitOtherPlayer && !TicTacToe.gameOver)
	{
		TicTacToe.ctx.font = `600 ${TicTacToe.canvas.height / 13}px Poppins, sans-serif`;
		TicTacToe.ctx.strokeText(
			"Waiting matchmaking..",
			TicTacToe.canvas.width / 2,
			TicTacToe.canvas.height / 1.25
		);
		TicTacToe.ctx.fillText(
			"Waiting matchmaking..",
			TicTacToe.canvas.width / 2,
			TicTacToe.canvas.height / 1.25
		);
	}
	else if (!TicTacToe.is_playing && TicTacToe.gameOver && TicTacToe.wonPlayer > 0)
	{
		TicTacToe.ctx.strokeText(
			`Player ${TicTacToe.wonPlayer} has won!`,
			TicTacToe.canvas.width / 2,
			TicTacToe.canvas.height / 1.25
		);
		TicTacToe.ctx.fillText(
			`Player ${TicTacToe.wonPlayer} has won!`,
			TicTacToe.canvas.width / 2,
			TicTacToe.canvas.height / 1.25
		);
		displayNavbar();
	}
	else if (!TicTacToe.is_playing && TicTacToe.gameOver && TicTacToe.wonPlayer == 0)
	{
		TicTacToe.ctx.strokeText(
			`Nobody won the game`,
			TicTacToe.canvas.width / 2,
			TicTacToe.canvas.height / 1.25
		);
		TicTacToe.ctx.fillText(
			`Nobody won the game`,
			TicTacToe.canvas.width / 2,
			TicTacToe.canvas.height / 1.25
		);
		displayNavbar();
	}
	// else
	// {
	// 	TicTacToe.ctx.fillText(
	// 		`Turn of player ${TicTacToe.playerTurn}`,
	// 		TicTacToe.canvas.width / 2,
	// 		TicTacToe.canvas.height / 18
	// 	);
	// }
}

function drawO(x, y) {
	TicTacToe.ctx.beginPath();
    TicTacToe.ctx.arc(x, y, TicTacToe.Display.cellSize / 3, 0, 2 * Math.PI);
    TicTacToe.ctx.stroke();
}


function drawX(x, y) {
    TicTacToe.ctx.beginPath();
    TicTacToe.ctx.moveTo(x - (TicTacToe.Display.cellSize / 3), y - (TicTacToe.Display.cellSize / 3));
    TicTacToe.ctx.lineTo(x + (TicTacToe.Display.cellSize / 3), y + (TicTacToe.Display.cellSize / 3));
    TicTacToe.ctx.moveTo(x - (TicTacToe.Display.cellSize / 3), y + (TicTacToe.Display.cellSize / 3));
    TicTacToe.ctx.lineTo(x + (TicTacToe.Display.cellSize / 3), y - (TicTacToe.Display.cellSize / 3));
    TicTacToe.ctx.stroke();
}

function getClickToPlay(event) {
	const rect = TicTacToe.canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	playGame(getCaseFromAxe(x), getCaseFromAxe(y));
}

function leaveTTT(event) {
	if (TicTacToe.is_playing)
	{
		if (event.target.id == "leave-match")
		{
			TicTacToe.is_playing = false;
			TicTacToe.gameOver = true;
			TicTacToe.wonPlayer = TicTacToe.playerTurn == 1 ? 2 : 1;
			document.removeEventListener('click', getClickToPlay);
			document.removeEventListener('click', leaveTTT);
			changeDisplayButtons();
			drawTicTacToe();
		}
	}
}

function handleEventsTTTMultiplayer() {
	document.addEventListener('click', getClickToPlay);
	document.addEventListener('click', leaveTTT);
}

export function playGame(x, y) {
	if (y == -1 || x == -1 || TicTacToe.cells[y][x] != 0 || TicTacToe.gameOver)
		return;
	TicTacToe.cells[y][x] = TicTacToe.playerTurn;
	TicTacToe.playerTurn == 1 ? TicTacToe.playerTurn = 2 : TicTacToe.playerTurn = 1;
	drawTicTacToe();
	var wonPlayer = checkWin();
	if (wonPlayer > 0)
		wonTTT(wonPlayer);
	if (wonPlayer == 0)
		noWonTTT();
}

export function getCaseFromAxe(pos) {
	if (pos > 0 && pos < TicTacToe.Display.cellSize)
		return 0;
	if (pos > TicTacToe.Display.cellSize + TicTacToe.Display.borderSize && pos < (TicTacToe.Display.cellSize * 2) + TicTacToe.Display.borderSize)
		return 1;
	if (pos > (TicTacToe.Display.cellSize * 2) + (TicTacToe.Display.borderSize * 2) && pos < TicTacToe.canvas.height)
		return 2;
	return -1
}

function checkWin() {
	for (let i = 0; i < 3; i++)
	{
		if (TicTacToe.cells[i][0] == 1 && TicTacToe.cells[i][1] == 1 && TicTacToe.cells[i][2] == 1)
			return (1);
		if (TicTacToe.cells[i][0] == 2 && TicTacToe.cells[i][1] == 2 && TicTacToe.cells[i][2] == 2)
			return (2);

		if (TicTacToe.cells[0][i] == 1 && TicTacToe.cells[1][i] == 1 && TicTacToe.cells[2][i] == 1)
			return (1);
		if (TicTacToe.cells[0][i] == 2 && TicTacToe.cells[1][i] == 2 && TicTacToe.cells[2][i] == 2)
			return (2);
	}
	if (TicTacToe.cells[0][0] == 1 && TicTacToe.cells[1][1] == 1 && TicTacToe.cells[2][2] == 1)
		return (1);
	if (TicTacToe.cells[0][2] == 1 && TicTacToe.cells[1][1] == 1 && TicTacToe.cells[2][0] == 1)
		return (1);
	if (TicTacToe.cells[0][0] == 2 && TicTacToe.cells[1][1] == 2 && TicTacToe.cells[2][2] == 2)
		return (2);
	if (TicTacToe.cells[0][2] == 2 && TicTacToe.cells[1][1] == 2 && TicTacToe.cells[2][0] == 2)
		return (2);

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (TicTacToe.cells[i][j] == 0)
				return (-1);
		}
	}
	return (0);
}

function wonTTT(wonPlayer) {
	TicTacToe.is_playing = false;
	TicTacToe.gameOver = true;
	TicTacToe.wonPlayer = wonPlayer;
	changeDisplayButtons();
	drawTicTacToe();
	if (TicTacToe.gamemod == GameMod.MULTI)
	{
		document.removeEventListener('click', getClickToPlay);
		document.removeEventListener('click', leaveTTT);
	}
	if (TicTacToe.gamemod == GameMod.REMOTE)
	{
		var send_data = {
			"type" : "host",
			"request": "win",
			"wonPlayer": TicTacToe.wonPlayer,
		};
		socket.send(JSON.stringify(send_data));
		TicTacToe.playerTurn = 0;
		displayTurn();
	}
}


function noWonTTT() {
	TicTacToe.is_playing = false;
	TicTacToe.gameOver = true;
	TicTacToe.wonPlayer = 0;
	changeDisplayButtons();
	drawTicTacToe();
	if (TicTacToe.gamemod == GameMod.MULTI)
	{
		document.removeEventListener('click', getClickToPlay);
		document.removeEventListener('click', leaveTTT);
	}
	if (TicTacToe.gamemod == GameMod.REMOTE)
	{
		var send_data = {
			"type" : "host",
			"request": "win",
			"wonPlayer": TicTacToe.wonPlayer,
		};
		socket.send(JSON.stringify(send_data));
		TicTacToe.playerTurn = 0;
		displayTurn();
	}
}

export function initHandleTTT() {
	handleEventsTicTacToe();
	initializeTicTacToe();
}