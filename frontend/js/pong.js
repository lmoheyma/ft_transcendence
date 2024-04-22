var Directions = {
    NOTHING: 0,
    UP: 1,
    DOWN: 2,
    RIGHT: 3,
    LEFT: 4,
}

const cgameY = 100;
const cgameX = 300;

var Game = {
    player1: {},
    player2: {},
    ball: {},
    display: {},
    _events: function () {
        document.addEventListener('click', (event) => {
            if (event.target.id == "start-btn")
            {
                if (!this.is_playing)
                {
                    this.is_playing = true;
                    this._start();
                }
            }
        })
        document.addEventListener('keydown', (event) => {
            if (event.key === "w" && this.is_playing)
                this.player1.dir = Directions.UP;
            if (event.key === "ArrowUp" && this.is_playing)
                this.player2.dir = Directions.UP;
            if (event.key === "s" && this.is_playing)
                this.player1.dir = Directions.DOWN;
            if (event.key === "ArrowDown" && this.is_playing)
                this.player2.dir = Directions.DOWN;
        })
        document.addEventListener('keyup', (event) => {
            if (event.key === "w" && this.player1.dir === Directions.UP)
                this.player1.dir = Directions.NOTHING;
            if (event.key === "s" && this.player1.dir === Directions.DOWN)
                    this.player1.dir = Directions.NOTHING;
            if (event.key === "ArrowUp" && this.player2.dir === Directions.UP)
                this.player2.dir = Directions.NOTHING;
            if (event.key === "ArrowDown" && this.player2.dir === Directions.DOWN)
                this.player2.dir = Directions.NOTHING;
        })
    },
    _start: function () {
        this._calculate_poses();
        this._drawAll();
        if (!this.gameOver)
            requestAnimationFrame(this._start.bind(this)); 
    },
    _initialize: function () {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.height = 600;
        this.canvas.width = 900;
        if (this.canvas.height * 1.5 != this.canvas.width)
            console.log("error");
        this.gameY = cgameY;
        this.gameX = cgameX;
        
        this.border_space = 3;
        this.border_size = 1.5;

        this.player_height = 18;
        this.player_width = this.border_space;

        this.player1.pos_Y = 50;
        this.player2.pos_Y = 50;
        this.player1.dir = Directions.NOTHING;
        this.player2.dir = Directions.NOTHING;
        this.player1.score = 0;
        this.player2.score = 0;

        this.ball.pos_X = 150;
        this.ball.pos_Y = 50;
        this.ball.size = this.border_space;
        this.ball.speed = 1;

        var randomNumber = Math.floor(Math.random() * 4);
        switch (randomNumber) {
            case 0:
            {
                this.ball.dir_X = Directions.LEFT;
                this.ball.dir_Y = Directions.UP;
                this.angle = 180;
                break;
            }
            case 1:
            {
                this.ball.dir_X = Directions.LEFT;
                this.ball.dir_Y = Directions.DOWN;
                this.angle = 180;
                break;
            }
            case 2:
            {
                this.ball.dir_X = Directions.RIGHT;
                this.ball.dir_Y = Directions.UP;
                this.angle = 0;
                break;
            }
            case 3:
            {
                this.ball.dir_X = Directions.RIGHT;
                this.ball.dir_Y = Directions.DOWN;
                this.angle = 0;
                break;
            }
        }

        this.gameIsEnd = false;
        this._drawAll()
    },
    _calculate_poses: function () {
        if (this.player1.pos_Y > 15 && this.player1.dir === Directions.UP)
            this.player1.pos_Y -= 1;
        if (this.player1.pos_Y < 85 && this.player1.dir === Directions.DOWN)
            this.player1.pos_Y += 1;
        if (this.player2.pos_Y > 15 && this.player2.dir === Directions.UP)
            this.player2.pos_Y -= 1;
        if (this.player2.pos_Y < 85 && this.player2.dir === Directions.DOWN)
            this.player2.pos_Y += 1;

        if (this.ball.pos_Y <= 6) {
            this.ball.dir_Y = Directions.DOWN;
            console.log(this.angle);
            this.angle = 360 - this.angle;
            console.log(this.angle);
            // return ;
        }
        if (this.ball.pos_Y >= 94) {
            this.ball.dir_Y = Directions.UP;
            console.log(this.angle);
            this.angle = 360 - this.angle;
            console.log(this.angle);
            // return ;
        }

        if (this.ball.pos_X <= 24 && (this.ball.pos_Y <= this.player1.pos_Y + 9 && this.ball.pos_Y >= this.player1.pos_Y - 9)) {
            if (this.ball.pos_Y - this.player1.pos_Y < 0)
                this.ball.dir_Y = Directions.UP;
            else if (this.ball.pos_Y - this.player1.pos_Y > 0)
                this.ball.dir_Y = Directions.DOWN;
            this.ball.dir_X = Directions.RIGHT;

            var side = Math.abs(this.ball.pos_Y - this.player1.pos_Y);
            if (side <= 1)
            {
                this.angle = 0;
                var randomNumber = Math.floor(Math.random() * 10);
                if (randomNumber < 5)
                    this.angle -= randomNumber / 2;
                else
                    this.angle += randomNumber / 2;
            }
            else
            {
                this.angle = side * 6.25;
                var randomNumber = Math.floor(Math.random() * 10);
                if (randomNumber < 5)
                    this.angle -= randomNumber / 2;
                else
                    this.angle += randomNumber / 2;

            }
            this.ball.dir_Y == Directions.DOWN ? this.angle = 360 - this.angle : this.angle = this.angle;
            this.ball.speed += 0.3;
        }
        if (this.ball.pos_X >= 276 && (this.ball.pos_Y <= this.player2.pos_Y + 9 && this.ball.pos_Y >= this.player2.pos_Y - 9)) {
            if (this.ball.pos_Y - this.player2.pos_Y < 0)
                this.ball.dir_Y = Directions.UP;
            else if (this.ball.pos_Y - this.player2.pos_Y > 0)
                this.ball.dir_Y = Directions.DOWN;
            this.ball.dir_X = Directions.LEFT;

            var side = Math.abs(this.ball.pos_Y - this.player2.pos_Y);
            if (side <= 1)
            {
                this.angle = 0;
                var randomNumber = Math.floor(Math.random() * 10);
                if (randomNumber < 5)
                    this.angle -= randomNumber / 2;
                else
                    this.angle += randomNumber / 2;
            }
            else
            {
                this.angle = side * 6.25;
                var randomNumber = Math.floor(Math.random() * 10);
                if (randomNumber < 5)
                    this.angle -= randomNumber / 2;
                else
                    this.angle += randomNumber / 2;

            }
            this.ball.dir_Y == Directions.DOWN ? this.angle = 180 + this.angle : this.angle = 180 - this.angle;
            this.ball.speed += 0.3;
        }

        if (this.ball.pos_X <= 12)
        {
            this._pointWon(2);
            return ;
        }
        if (this.ball.pos_X >= 288)
        {
            this._pointWon(1);
            return ;
        }

        this.radAngle = -(this.angle * Math.PI / 180);
        this.ball.pos_Y += this.ball.speed * Math.sin(this.radAngle);
        this.ball.pos_X += this.ball.speed * Math.cos(this.radAngle);
    },
    _updateDisplay: function () {
        this.display.border_space = this.border_space * this.canvas.height / this.gameY;
        this.display.border_size = this.display.border_space / 2;

        this.display.player1_pos_Y = this.player1.pos_Y * this.canvas.height / this.gameY;
        this.display.player2_pos_Y = this.player2.pos_Y * this.canvas.height / this.gameY;
        this.display.player_height = this.player_height * this.canvas.height / this.gameY;
        this.display.player_width = this.player_width * this.canvas.height / this.gameY;

        this.display.ball_pos_X = this.ball.pos_X * this.canvas.width / this.gameX;
        this.display.ball_pos_Y = this.ball.pos_Y * this.canvas.height / this.gameY;
        this.display.ball_size = this.ball.size * this.canvas.height / this.gameY;
    },
    _drawAll: function () {
        this._updateDisplay();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#FFFFFF";

        this.ctx.fillRect(this.display.border_space, this.display.border_space, this.canvas.width - (2 * this.display.border_space), this.display.border_size);
        this.ctx.fillRect(this.display.border_space, this.canvas.height - (2 * this.display.border_space - this.display.border_size), this.canvas.width - (2 * this.display.border_space), this.display.border_size);
        this.ctx.fillRect(this.display.border_space, this.display.border_space, this.display.border_size, this.canvas.height - (2 * this.display.border_space));
        this.ctx.fillRect(this.canvas.width - (2 * this.display.border_space - this.display.border_size), this.display.border_space, this.display.border_size, this.canvas.height - (2 * this.display.border_space));


        this.ctx.fillRect(2 * this.display.border_space + this.display.border_size, this.display.player1_pos_Y - (this.display.player_height / 2), this.display.player_width, this.display.player_height);

        this.ctx.fillRect(this.canvas.width - (3 * this.display.border_space + this.display.border_size), this.display.player2_pos_Y - (this.display.player_height / 2), this.display.player_width, this.display.player_height);

        this.ctx.fillRect(this.display.ball_pos_X - (this.display.ball_size / 2), this.display.ball_pos_Y - (this.display.ball_size / 2), this.display.ball_size, this.display.ball_size);

        this.ctx.beginPath();
        this.ctx.setLineDash([20, 10]);
        this.ctx.moveTo((this.canvas.width / 2), this.canvas.height - (this.display.border_space * 2));
        this.ctx.lineTo((this.canvas.width / 2), this.display.border_space * 2);
        this.ctx.lineWidth = this.canvas.height / 120;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.stroke();

        this.ctx.font = `${this.canvas.height / 6}px Verdana`;
        this.ctx.textAlign = 'center';

        this.ctx.fillText(
            this.player1.score.toString(),
            (this.canvas.width / 2) - this.canvas.height / 12,
            this.canvas.height / 6 + this.display.border_space
        );

        this.ctx.fillText(
            this.player2.score.toString(),
            (this.canvas.width / 2) + this.canvas.height / 12,
            this.canvas.height / 6 + this.display.border_space
        );

    },
    _pointWon: function (player) {
        var randomNumber = Math.floor(Math.random() * 2);
        if (player === 1)
        {
            this.player1.score++;
            switch (randomNumber) {
                case 0:
                {
                    this.ball.dir_Y = Directions.UP;
                    break;
                }
                case 1:
                {
                    this.ball.dir_Y = Directions.DOWN;
                    break;
                }
            }
            this.ball.dir_X = Directions.LEFT;
            this.angle = 0;
        }
        else
        {
            this.player2.score++;
            switch (randomNumber) {
                case 0:
                {
                    this.ball.dir_Y = Directions.UP;
                    break;
                }
                case 1:
                {
                    this.ball.dir_Y = Directions.DOWN;
                    break;
                }
            }
            this.ball.dir_X = Directions.RIGHT;
            this.angle = 180;
        }
        this.player1.pos_Y = 50;
        this.player2.pos_Y = 50;
        this.player1.dir = Directions.NOTHING;
        this.player2.dir = Directions.NOTHING;
        this.ball.pos_X = 150;
        this.ball.pos_Y = 50;
        this.ball.speed = 1;
    }
}

Game._initialize();
Game._events();