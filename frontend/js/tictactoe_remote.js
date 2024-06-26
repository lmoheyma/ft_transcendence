import { socket, TicTacToe, drawTicTacToe, getCaseFromAxe, playGame, GameMod, changeDisplayButtons } from './tictactoe.js';

export var waitOtherPlayer = false;
export var interval;
export var type = "";
export var adversaryType = "";
export var connectedPlayers = 0;
var turnTitle = document.getElementById('against-title');

export function displayTurn() 
{
	if (TicTacToe.playerTurn == 0)
		turnTitle.textContent = '';
	else if ((TicTacToe.playerTurn == 1 && type === "host") || (TicTacToe.playerTurn == 2 && type === "guest"))
		turnTitle.textContent = "Your turn";
	else
		turnTitle.textContent = "Ennemy turn";
}
function updateTTTView() {
	if (socket.readyState === WebSocket.OPEN) {
		if (TicTacToe.is_playing)
		{
			var send_data = {
				"type" : type,
				"request": "ff",
				"wonPlayer": 2,
			};
			socket.send(JSON.stringify(send_data));
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					TicTacToe.cells[i][j] = 0;
				}
			}
			TicTacToe.playerTurn = 0;
			TicTacToe.is_playing = false;
			TicTacToe.gameOver = true;
			displayTurn();
			changeDisplayButtons();
			drawTicTacToe();
		}
		socket.close();
		waitOtherPlayer = false;
		type = "";
		adversaryType = "";
		drawTicTacToe();
		console.log('Forfait');
		// alert('Forfait');
	}
}

function remoteTTTclick(event) {
	const rect = TicTacToe.canvas.getBoundingClientRect();
	const x = getCaseFromAxe(event.clientX - rect.left);
	const y = getCaseFromAxe(event.clientY - rect.top);
	if (type && type === "host")
	{
		if (TicTacToe.gamemod == GameMod.REMOTE && TicTacToe.playerTurn == 1 && TicTacToe.is_playing)
		{
			playGame(x, y);
			var send_data = {
				"type" : type,
				"request": "game",
				"cells": TicTacToe.cells,
				"playerTurn": TicTacToe.playerTurn,
			};
			socket.send(JSON.stringify(send_data));
			displayTurn();
		}
	}
	if (type && type === "guest")
	{
		if (TicTacToe.playerTurn == 2 && TicTacToe.is_playing)
		{
			if (y == -1 || x == -1 || TicTacToe.cells[y][x] != 0 || TicTacToe.gameOver)
				return;
			var send_data = {
				"type" : "guest",
				"request": "game",
				"case_x": x,
				"case_y": y,
			};
			socket.send(JSON.stringify(send_data));
			displayTurn();
		}
	}
}

function leaveTTTRemote(event) {
	if (TicTacToe.is_playing || waitOtherPlayer)
	{
		if (event.target.id == "leave-match")
		{
			if (TicTacToe.is_playing)
			{
				var send_data = {
					"type" : type,
					"request": "ff",
					"wonPlayer": 2,
				};
				socket.send(JSON.stringify(send_data));
				for (let i = 0; i < 3; i++) {
					for (let j = 0; j < 3; j++) {
						TicTacToe.cells[i][j] = 0;
					}
				}
				TicTacToe.playerTurn = 0;
				TicTacToe.gameOver = true;
				displayTurn();
			}
			if (TicTacToe.is_playing || waitOtherPlayer)
			{
				socket.close();
				TicTacToe.is_playing = false;
				changeDisplayButtons();
				waitOtherPlayer = false;
				type = "";
				adversaryType = "";
				drawTicTacToe();
			}
		}
	}
}

export function handleEventsTTTRemote() {

	socket.onopen = function(e) {
		console.log("Connected");
		// alert("Connected");
		waitOtherPlayer = true;
		drawTicTacToe();
	};
	
	socket.onmessage = function (event) {
		// console.log(`[message] Data received from server: ${event.data}`);
		var msg = JSON.parse(event.data);
		var data = JSON.parse(msg.message);
		if (!type && data.type === "player")
		{
			type = data.you == 1 ? "host" : "guest";
			adversaryType = data.you == 1 ? "guest" : "host";
			var send_data = {
				"type" : type,
				"request": "connexion",
				"playerTurn": TicTacToe.playerTurn,
			};
			socket.send(JSON.stringify(send_data));
		}
		else if (type == "host" && data.type === adversaryType)
		{
			switch (data.request) {
				case "connexion":
				{
					connectedPlayers = data.connected_clients;
					if (connectedPlayers == 2 && !TicTacToe.is_playing)
					{
						TicTacToe.is_playing = true;
						waitOtherPlayer = false;
						var send_data = {
							"type" : type,
							"request": "connexion",
							"playerTurn": TicTacToe.playerTurn,
						};
						socket.send(JSON.stringify(send_data));
						send_data = {
							"type" : type,
							"request": "game",
							"cells": TicTacToe.cells,
							"playerTurn": TicTacToe.playerTurn,
						};
						socket.send(JSON.stringify(send_data));
						displayTurn();
						drawTicTacToe();
					}
					break;
				}
				case "game":
				{
					if (TicTacToe.playerTurn == 2 && TicTacToe.is_playing)
					{
						playGame(data.case_x, data.case_y);
						var send_data = {
							"type" : type,
							"request": "game",
							"cells": TicTacToe.cells,
							"playerTurn": TicTacToe.playerTurn,
						};
						socket.send(JSON.stringify(send_data));
						displayTurn();
						drawTicTacToe();
					}
					break;
				}
				case "ff":
				{
					for (let i = 0; i < 3; i++) {
						for (let j = 0; j < 3; j++) {
							TicTacToe.cells[i][j] = 0;
						}
					}
					TicTacToe.playerTurn = 0;
					TicTacToe.is_playing = false;
					TicTacToe.gameOver = true;
					changeDisplayButtons();
					socket.close();
					type = "";
					adversaryType = "";
					displayTurn();
					drawTicTacToe();
					displayNavbar();
					alert('Victoire par forfait');
					break;
				}
				default:
				{
					alert("error in socket message");
					break;
				}
			}
		}
		else if (type == "guest" && data.type === adversaryType)
		{
			switch (data.request) {
				case "connexion":
				{
					TicTacToe.playerTurn = data.playerTurn;
					connectedPlayers = data.connected_clients;
					if (connectedPlayers == 2 && !TicTacToe.is_playing)
					{
						TicTacToe.is_playing = true;
						waitOtherPlayer = false;
						var send_data = {
							"type" : type,
							"request": "connexion",
						};
						socket.send(JSON.stringify(send_data));
						displayTurn();
						drawTicTacToe();
					}
					break;
				}
				case "game":
				{
					TicTacToe.cells = data.cells;
					TicTacToe.playerTurn = data.playerTurn;
					connectedPlayers = data.connected_clients;
					displayTurn();
					drawTicTacToe();
					break;
				}
				case "win":
				{
					TicTacToe.is_playing = false;
					TicTacToe.gameOver = true;
					changeDisplayButtons();
					TicTacToe.wonPlayer = data.wonPlayer;
					TicTacToe.playerTurn = 0;
					displayTurn();
					drawTicTacToe();
					break;
				}
				case "ff":
				{
					for (let i = 0; i < 3; i++) {
						for (let j = 0; j < 3; j++) {
							TicTacToe.cells[i][j] = 0;
						}
					}
					TicTacToe.playerTurn = 0;
					TicTacToe.is_playing = false;
					TicTacToe.gameOver = true;
					changeDisplayButtons();
					socket.close();
					type = "";
					adversaryType = "";
					drawTicTacToe();
					displayTurn();
					displayNavbar();
					alert('Victoire par forfait');
					break;
				}
				default:
				{
					alert("error in socket message");
					break;
				}
			}
		}
	};
	
	document.addEventListener('visibilitychange', updateTTTView);
	document.addEventListener('click', remoteTTTclick);
	document.addEventListener('click', leaveTTTRemote);

	socket.onclose = function(event) {
		document.removeEventListener('click', updateTTTView);
		document.removeEventListener('click', remoteTTTclick);
		document.removeEventListener('click', leaveTTTRemote);
		console.log('Connection died');
		// alert('Connection died');
	}
}