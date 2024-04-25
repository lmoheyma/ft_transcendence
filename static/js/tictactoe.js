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
	wonPlayer: 0,
}

var GameMod = {
    MULTI: 0,
    REMOTE: 1,
    AI: 2,
}

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
					// initializeGameData();
					TicTacToe.is_playing = true;
					initializeTTTData();
					drawTicTacToe();
					handleEventsTTTMultiplayer();
					break;
				}
				// case "remote-btn":
				// {
				// 	Game.gameOver = false;
				// 	Game.gamemod = GameMod.REMOTE;
				// 	handleEventsPongRemoteP1();
				// 	initializeGameData();
				// 	break;
				// }
				// case "remote-btn2":
				// {
				// 	Game.gameOver = false;
				// 	Game.gamemod = GameMod.REMOTE;
				// 	handleEventsPongRemoteP2();
				// 	initializeGameData();
				// 	break;
				// }
				default:
					break;
			}
		}
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
	TicTacToe.ctx.lineWidth = 20;
	
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
	if (!TicTacToe.is_playing && !TicTacToe.gameOver)
	{
		TicTacToe.ctx.fillText(
			"Press the button to start",
			TicTacToe.canvas.width / 2,
			TicTacToe.canvas.height / 2
		);
	}
	else if (!TicTacToe.is_playing && TicTacToe.gameOver)
	{
		TicTacToe.ctx.fillText(
			`Player ${TicTacToe.wonPlayer} has won the game`,
			TicTacToe.canvas.width / 2,
			TicTacToe.canvas.height / 2
		);

	}
}

drawO = function (x, y) {
	TicTacToe.ctx.beginPath();
    TicTacToe.ctx.arc(x, y, 100, 0, 2 * Math.PI);
    TicTacToe.ctx.stroke();
}


drawX = function (x, y) {
    TicTacToe.ctx.beginPath();
    TicTacToe.ctx.moveTo(x - 100, y - 100);
    TicTacToe.ctx.lineTo(x + 100, y + 100);
    TicTacToe.ctx.moveTo(x - 100, y + 100);
    TicTacToe.ctx.lineTo(x + 100, y - 100);
    TicTacToe.ctx.stroke();
}

handleEventsTTTMultiplayer = function () {
	document.addEventListener('click', (event) => {
		const rect = TicTacToe.canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		playGame(x, y);
	});
}

playGame = function (x, y) {
	var i = getCaseFromAxe(y);
	var j = getCaseFromAxe(x);
	if (i == -1 || j == -1 || TicTacToe.cells[i][j] != 0 || TicTacToe.gameOver)
		return;
	TicTacToe.cells[i][j] = TicTacToe.playerTurn;
	TicTacToe.playerTurn == 1 ? TicTacToe.playerTurn = 2 : TicTacToe.playerTurn = 1;
	drawTicTacToe();
	var wonPlayer = checkWin();
	if (wonPlayer != -1)
		wonTTT(wonPlayer);
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
	return (-1);
}

wonTTT = function (wonPlayer) {
	TicTacToe.is_playing = false;
	TicTacToe.gameOver = true;
	TicTacToe.wonPlayer = wonPlayer;
	drawTicTacToe();
}


handleEventsTicTacToe();
initializeTicTacToe();