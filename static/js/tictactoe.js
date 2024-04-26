TicTacToe = {
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

var GameMod = {
    MULTI: 0,
    REMOTE: 1,
    AI: 2,
}

var waitOtherPlayer = false;

// remote

initializeTicTacToe = function () {
	TicTacToe.canvas = document.querySelector('canvas');
	TicTacToe.ctx = TicTacToe.canvas.getContext('2d');

	var totalSize;
	if (window.innerHeight < window.innerWidth)
	{
		totalSize = window.innerHeight - 300;
		TicTacToe.canvas.height = totalSize;
		TicTacToe.canvas.width = totalSize;
	}
	else
	{
		totalSize = window.innerWidth;
		TicTacToe.canvas.height = totalSize;
		TicTacToe.canvas.width = totalSize;
	}

	initializeTTTData();
	drawTicTacToe();
}

initializeTTTData = function () {
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


handleEventsTicTacToe = function () {
	document.addEventListener('click', (event) => {
		if (!TicTacToe.is_playing)
		{
			switch (event.target.id) {
				case "multi-btn":
				{
					TicTacToe.gameOver = false;
					TicTacToe.gamemod = GameMod.MULTI;
					TicTacToe.is_playing = true;
					initializeTTTData();
					drawTicTacToe();
					handleEventsTTTMultiplayer();
					break;
				}
				case "remote-btn":
				{
					TicTacToe.gameOver = false;
					TicTacToe.gamemod = GameMod.REMOTE;
					socket = new WebSocket(`ws://localhost:8000/ws/room/pong/1`);
					initializeTTTData();
					handleEventsTTTRemoteP1();
					break;
				}
				case "remote-btn2":
				{
					TicTacToe.gameOver = false;
					TicTacToe.gamemod = GameMod.REMOTE;
					socket = new WebSocket(`ws://localhost:8000/ws/room/pong/2`);
					initializeTTTData();
					handleEventsTTTRemoteP2();
					break;
				}
				default:
					break;
			}
		}
	});
	window.addEventListener("resize", (event) => {
		var totalSize;
		if (window.innerHeight < window.innerWidth)
		{
			totalSize = window.innerHeight - 300;
			TicTacToe.canvas.height = totalSize;
			TicTacToe.canvas.width = totalSize;
		}
		else
		{
			totalSize = window.innerWidth - 300;
			TicTacToe.canvas.height = totalSize;
			TicTacToe.canvas.width = totalSize;
		}

		if (TicTacToe.canvas.width > 900)
		{
			TicTacToe.canvas.height = 900;
			TicTacToe.canvas.width = 900;
		}

		if (window.innerHeight < 450)
		{
			TicTacToe.canvas.height = 150;
			TicTacToe.canvas.width = 150;
		}

		drawTicTacToe();
	});

}

updateDisplayTTT = function () {
	TicTacToe.Display.borderSize = TicTacToe.borderSize * TicTacToe.canvas.height / TicTacToe.totalSize;
	TicTacToe.Display.cellSize = TicTacToe.cellSize * TicTacToe.canvas.height / TicTacToe.totalSize;
}

drawTicTacToe = function () {
	updateDisplayTTT();
	TicTacToe.ctx.clearRect(0, 0, TicTacToe.canvas.width, TicTacToe.canvas.height);

	TicTacToe.ctx.fillStyle = "#C0FFFC";
	TicTacToe.ctx.fillRect(0, 0, TicTacToe.canvas.width, TicTacToe.canvas.height);
	
	TicTacToe.ctx.fillStyle = "#FFFFFF";

	TicTacToe.ctx.fillRect(TicTacToe.Display.cellSize, 0, TicTacToe.Display.borderSize, TicTacToe.canvas.height);
	TicTacToe.ctx.fillRect(TicTacToe.Display.cellSize * 2 + TicTacToe.Display.borderSize, 0, TicTacToe.Display.borderSize, TicTacToe.canvas.height);
	TicTacToe.ctx.fillRect(0, TicTacToe.Display.cellSize, TicTacToe.canvas.height, TicTacToe.Display.borderSize);
	TicTacToe.ctx.fillRect(0, TicTacToe.Display.cellSize * 2 + TicTacToe.Display.borderSize, TicTacToe.canvas.height, TicTacToe.Display.borderSize);

	var x;
	var y;
	TicTacToe.ctx.strokeStyle = "#FFFFFF";
	TicTacToe.ctx.lineWidth = TicTacToe.Display.cellSize / 10;
	
	for (let i = 0; i < 3; i++)
	{
		y = (TicTacToe.Display.cellSize * i) + (TicTacToe.Display.borderSize * i) + (TicTacToe.Display.cellSize / 2);
		for (let j = 0; j < 3; j++)
		{
			x = (TicTacToe.Display.cellSize * j) + (TicTacToe.Display.borderSize * j) + (TicTacToe.Display.cellSize / 2);
			if (TicTacToe.cells[i][j] == 1)
				drawO(x, y);
			else if (TicTacToe.cells[i][j] == 2)
				drawX(x, y);
		}
	}

	TicTacToe.ctx.fillStyle = "#000000";
	TicTacToe.ctx.textAlign = 'center';
	TicTacToe.ctx.font = `${TicTacToe.canvas.height / 15}px Verdana`;
	if (!TicTacToe.is_playing && !waitOtherPlayer)
	{
		TicTacToe.ctx.fillText(
			"Press the button to start",
			TicTacToe.canvas.width / 2,
			TicTacToe.canvas.height / 2
		);
	}
	else if (!TicTacToe.is_playing && waitOtherPlayer)
	{
		TicTacToe.ctx.fillText(
			"Waiting creation of matchmaking",
			TicTacToe.canvas.width / 2,
			TicTacToe.canvas.height / 2
		);
	}
	else if (!TicTacToe.is_playing && TicTacToe.gameOver && TicTacToe.wonPlayer > 0)
	{
		TicTacToe.ctx.fillText(
			`Player ${TicTacToe.wonPlayer} has won the game`,
			TicTacToe.canvas.width / 2,
			TicTacToe.canvas.height / 2
		);
	}
	else if (!TicTacToe.is_playing && TicTacToe.gameOver && TicTacToe.wonPlayer == 0)
	{
		TicTacToe.ctx.fillText(
			`Nobody won the game`,
			TicTacToe.canvas.width / 2,
			TicTacToe.canvas.height / 2
		);
	}
	else
	{
		TicTacToe.ctx.fillText(
			`Turn of player ${TicTacToe.playerTurn}`,
			TicTacToe.canvas.width / 2,
			TicTacToe.canvas.height / 18
		);
	}
}

drawO = function (x, y) {
	TicTacToe.ctx.beginPath();
    TicTacToe.ctx.arc(x, y, TicTacToe.Display.cellSize / 2.5, 0, 2 * Math.PI);
    TicTacToe.ctx.stroke();
}


drawX = function (x, y) {
    TicTacToe.ctx.beginPath();
    TicTacToe.ctx.moveTo(x - (TicTacToe.Display.cellSize / 2.5), y - (TicTacToe.Display.cellSize / 2.5));
    TicTacToe.ctx.lineTo(x + (TicTacToe.Display.cellSize / 2.5), y + (TicTacToe.Display.cellSize / 2.5));
    TicTacToe.ctx.moveTo(x - (TicTacToe.Display.cellSize / 2.5), y + (TicTacToe.Display.cellSize / 2.5));
    TicTacToe.ctx.lineTo(x + (TicTacToe.Display.cellSize / 2.5), y - (TicTacToe.Display.cellSize / 2.5));
    TicTacToe.ctx.stroke();
}

handleEventsTTTMultiplayer = function () {
	document.addEventListener('click', (event) => {
		const rect = TicTacToe.canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		playGame(getCaseFromAxe(x), getCaseFromAxe(y));
	});
}

playGame = function (x, y) {
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

getCaseFromAxe = function (pos) {
	if (pos > 0 && pos < TicTacToe.Display.cellSize)
		return 0;
	if (pos > TicTacToe.Display.cellSize + TicTacToe.Display.borderSize && pos < (TicTacToe.Display.cellSize * 2) + TicTacToe.Display.borderSize)
		return 1;
	if (pos > (TicTacToe.Display.cellSize * 2) + (TicTacToe.Display.borderSize * 2) && pos < TicTacToe.canvas.height)
		return 2;
	return -1
}

checkWin = function () {
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

wonTTT = function (wonPlayer) {
	TicTacToe.is_playing = false;
	TicTacToe.gameOver = true;
	TicTacToe.wonPlayer = wonPlayer;
	drawTicTacToe();
	if (TicTacToe.gamemod == GameMod.REMOTE)
	{
		var send_data = {
			"type" : "host",
			"request": "win",
			"wonPlayer": TicTacToe.wonPlayer,
		};
		socket.send(JSON.stringify(send_data));
	}
}


noWonTTT = function () {
	TicTacToe.is_playing = false;
	TicTacToe.gameOver = true;
	TicTacToe.wonPlayer = 0;
	drawTicTacToe();
	if (TicTacToe.gamemod == GameMod.REMOTE)
	{
		var send_data = {
			"type" : "host",
			"request": "win",
			"wonPlayer": TicTacToe.wonPlayer,
		};
		socket.send(JSON.stringify(send_data));
	}
}


handleEventsTicTacToe();
initializeTicTacToe();