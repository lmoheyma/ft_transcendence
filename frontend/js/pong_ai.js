var moveInterval, predictInterval;
var predictedPosYAi;

function moveAiListener(event) {
	if (event.key === "w" && Game.is_playing)
		Player1.dir = Directions.UP;
	if (event.key === "s" && Game.is_playing)
		Player1.dir = Directions.DOWN;
}

function stopMoveAiListener(event) {
	if (event.key === "w" && Player1.dir === Directions.UP)
		Player1.dir = Directions.NOTHING;
	if (event.key === "s" && Player1.dir === Directions.DOWN)
			Player1.dir = Directions.NOTHING;
}

function leavePongAi(event) {
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
			clearInterval(predictInterval);
			clearInterval(moveInterval);
			document.removeEventListener('keydown', moveAiListener);
			document.removeEventListener('keyup', stopMoveAiListener);
			document.removeEventListener('click', leavePongAi);
		}
	}
}

function handleEventsPongAiplayer() {

	predictInterval = setInterval(() => {
		predictImpactHeightRight();
	}, 1000)
	moveInterval = setInterval(() => {
		if (predictedPosYAi < Player2.pos_Y + 5 && predictedPosYAi > Player2.pos_Y - 5)
		Player2.dir = Directions.NOTHING;
		else if (Player2.pos_Y < predictedPosYAi)
			Player2.dir = Directions.DOWN;
		else if (Player2.pos_Y > predictedPosYAi)
			Player2.dir = Directions.UP;
	}, 5)

	document.addEventListener('keydown', moveAiListener);
	document.addEventListener('keyup', stopMoveAiListener);
	document.addEventListener('click', leavePongAi);
}

function predictImpactHeightRight() {

	if (Ball.dir_X != Directions.RIGHT)
	{
		predictedPosYAi = Math.floor(Math.random() * 20) + 40;
		return ;
	}

    var posX = Ball.pos_X;
    var posY = Ball.pos_Y;
	var dirY = Ball.dir_Y;
    var angle = Ball.angle;
    var speed = Ball.speed;
	
	var precision = Math.floor(Math.random() * ((276 - posX) / 5));

    while (posX < 276) {
        if (posY <= 6) {
			dirY = Directions.DOWN;
			angle = 360 - angle;
		}
		if (posY >= 94) {
			dirY = Directions.UP;
			angle = 360 - angle;
		}
		var radAngle = -(angle * Math.PI / 180);
		posY += speed * Math.sin(radAngle);
		posX += speed * Math.cos(radAngle);
    }
	
	var randomNumber = Math.floor(Math.random() * 2);

    predictedPosYAi = randomNumber == 0 ? posY + precision : posY - precision;
}
