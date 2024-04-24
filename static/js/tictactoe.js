TicTacToe = {
	canva: null,
	ctx: null,
	is_playing: false,
	cells: [],
	cellSize: null,
}




initializeTicTacToe = function () {
	Game.canvas = document.querySelector('canvas');
	Game.ctx = Game.canvas.getContext('2d');

	var totalSize;
	if (window.innerHeight < window.innerWidth)
		{
			totalSize = window.innerHeight - 200;
			TicTacToe.canvas.height = totalSize;
			TicTacToe.canvas.width = totalSize;
		}
		else
		{
			totalSize = window.innerWidth;
			TicTacToe.canvas.height = totalSize;
			TicTacToe.canvas.width = totalSize;
		}

		drawTicTacToe();
}


handleEventsTicTacToe = function () {
	document.addEventListener('click', (event) => {
		if (!Game.is_playing)
		{
			switch (event.target.id) {
				case "multi-btn":
				{
					Game.gameOver = false;
					Game.gamemod = GameMod.MULTI;
					handleEventsPongMultiplayer();
					initializeGameData();
					Game.is_playing = true;
					startGame();
					break;
				}
				case "remote-btn":
				{
					Game.gameOver = false;
					Game.gamemod = GameMod.REMOTE;
					handleEventsPongRemoteP1();
					initializeGameData();
					break;
				}
				case "remote-btn2":
				{
					Game.gameOver = false;
					Game.gamemod = GameMod.REMOTE;
					handleEventsPongRemoteP2();
					initializeGameData();
					break;
				}
				default:
					break;
			}
		}
	});

}

drawTicTacToe = function () {

}

handleEventsTicTacToe();
initializeTicTacToe();