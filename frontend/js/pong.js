var Directions = {
    NOTHING: 0,
    UP: 1,
    DOWN: 2,
    RIGHT: 3,
    LEFT: 4,
}

var Game = {
    player1: {},
    player2: {},
    ball: {},
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
        console.log(this.player1.score + " " + this.player2.score);
        this._drawAll();
        if (!this.gameOver)
            requestAnimationFrame(this._start.bind(this)); 
    },
    _initialize: function () {
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.height = 600;
        this.canvas.width = 900;
        this.gameY = 100;
        this.gameX = 300;
        
        this.border_space = this.canvas.height / 30;
        this.border_size = this.border_space / 2;

        this.player1.pos_display_Y = this.canvas.height / 2;
        this.player2.pos_display_Y = this.canvas.height / 2;
        this.player1.pos_game_Y = 50;
        this.player2.pos_game_Y = 50;
        this.player_height = this.canvas.height / 6;
        this.player_witdh = this.border_space;
        this.player1.dir = Directions.NOTHING;
        this.player2.dir = Directions.NOTHING;
        this.player1.score = 0;
        this.player2.score = 0;

        this.ball.pos_game_X = 150;
        this.ball.pos_game_Y = 50;
        this.ball.pos_display_X = this.canvas.width / 2;
        this.ball.pos_display_Y = this.canvas.height / 2;
        this.ball.size = this.border_space;
        this.ball.speed = 0.25;

        var randomNumber = Math.floor(Math.random() * 4);
        switch (randomNumber) {
            case 0:
            {
                this.ball.dir_X = Directions.LEFT;
                this.ball.dir_Y = Directions.UP;
                break;
            }
            case 1:
            {
                this.ball.dir_X = Directions.LEFT;
                this.ball.dir_Y = Directions.DOWN;
                break;
            }
            case 2:
            {
                this.ball.dir_X = Directions.RIGHT;
                this.ball.dir_Y = Directions.UP;
                break;
            }
            case 3:
            {
                this.ball.dir_X = Directions.RIGHT;
                this.ball.dir_Y = Directions.DOWN;
                break;
            }
        }

        this.gameIsEnd = false;

        this._drawAll()
    },
    _calculate_poses: function () {
        if (this.player1.pos_game_Y > 15 && this.player1.dir === Directions.UP)
            this.player1.pos_game_Y -= 0.5;
        if (this.player1.pos_game_Y < 85 && this.player1.dir === Directions.DOWN)
            this.player1.pos_game_Y += 0.5;
        if (this.player2.pos_game_Y > 15 && this.player2.dir === Directions.UP)
            this.player2.pos_game_Y -= 0.5;
        if (this.player2.pos_game_Y < 85 && this.player2.dir === Directions.DOWN)
            this.player2.pos_game_Y += 0.5;

        if (this.ball.pos_game_Y <= 6.5)
            this.ball.dir_Y = Directions.DOWN;
        if (this.ball.pos_game_Y >= 93.5)
            this.ball.dir_Y = Directions.UP;

        if (this.ball.pos_game_X <= 26 && (this.ball.pos_game_Y <= this.player1.pos_game_Y + 8.3 && this.ball.pos_game_Y >= this.player1.pos_game_Y - 8.3))
            this.ball.dir_X = Directions.RIGHT;
        if (this.ball.pos_game_X >= 274 && (this.ball.pos_game_Y <= this.player2.pos_game_Y + 8.3 && this.ball.pos_game_Y >= this.player2.pos_game_Y - 8.3))
            this.ball.dir_X = Directions.LEFT;

        if (this.ball.pos_game_X <= 13)
        {
            this._pointWon(2);
            return ;
        }
        if (this.ball.pos_game_X >= 287)
        {
            this._pointWon(1);
            return ;
        }

        if (this.ball.dir_Y === Directions.UP)
            this.ball.pos_game_Y -= this.ball.speed;
        else if (this.ball.dir_Y === Directions.DOWN)
            this.ball.pos_game_Y += this.ball.speed;
        if (this.ball.dir_X === Directions.LEFT)
            this.ball.pos_game_X -= this.ball.speed;
        else if (this.ball.dir_X === Directions.RIGHT)
            this.ball.pos_game_X += this.ball.speed;

        this.player1.pos_display_Y = this.player1.pos_game_Y * this.canvas.height / this.gameY;
        this.player1.pos_display_X = this.player1.pos_game_X * this.canvas.width / this.gameX;
        this.player2.pos_display_Y = this.player2.pos_game_Y * this.canvas.height / this.gameY;
        this.player2.pos_display_X = this.player2.pos_game_X * this.canvas.width / this.gameX;
        this.ball.pos_display_Y = this.ball.pos_game_Y * this.canvas.height / this.gameY;
        this.ball.pos_display_X = this.ball.pos_game_X * this.canvas.width / this.gameX;
    },
    _drawAll: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#FFFFFF";

        this.ctx.fillRect(this.border_space, this.border_space, this.canvas.width - (2 * this.border_space), this.border_size);
        this.ctx.fillRect(this.border_space, this.canvas.height - (2 * this.border_space - this.border_size), this.canvas.width - (2 * this.border_space), this.border_size);
        this.ctx.fillRect(this.border_space, this.border_space, this.border_size, this.canvas.height - (2 * this.border_space));
        this.ctx.fillRect(this.canvas.width - (2 * this.border_space - this.border_size), this.border_space, this.border_size, this.canvas.height - (2 * this.border_space));


        this.ctx.fillRect(2 * this.border_space + this.border_size, this.player1.pos_display_Y - (this.player_height / 2), this.player_witdh, this.player_height);

        this.ctx.fillRect(this.canvas.width - (3 * this.border_space + this.border_size), this.player2.pos_display_Y - (this.player_height / 2), this.player_witdh, this.player_height);

        this.ctx.fillRect(this.ball.pos_display_X - (this.ball.size / 2), this.ball.pos_display_Y - (this.ball.size / 2), this.ball.size, this.ball.size);

        this.ctx.beginPath();
        this.ctx.setLineDash([20, 10]);
        this.ctx.moveTo((this.canvas.width / 2), this.canvas.height - (this.border_space * 2));
        this.ctx.lineTo((this.canvas.width / 2), this.border_space * 2);
        this.ctx.lineWidth = this.canvas.height / 120;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.stroke();

        this.ctx.font = '100px Times New Roman';
        this.ctx.textAlign = 'center';

        this.ctx.fillText(
            this.player1.score.toString(),
            (this.canvas.width / 2) - 50,
            110
        );

        this.ctx.fillText(
            this.player2.score.toString(),
            (this.canvas.width / 2) + 50,
            110
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
        }

        this.player1.pos_display_Y = this.canvas.height / 2;
        this.player2.pos_display_Y = this.canvas.height / 2;
        this.player1.pos_game_Y = 50;
        this.player2.pos_game_Y = 50;
        this.player1.dir = Directions.NOTHING;
        this.player2.dir = Directions.NOTHING;
        this.ball.pos_game_X = 150;
        this.ball.pos_game_Y = 50;
        this.ball.pos_display_X = this.canvas.width / 2;
        this.ball.pos_display_Y = this.canvas.height / 2;
        this.ball.speed = 0.25;
    }
}

Game._initialize();
Game._events();