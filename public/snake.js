const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
let snake;
let food;
let interval;
let score = 0;

document.getElementById('startButton').addEventListener('click', startGame);

function startGame() {
    if (interval) clearInterval(interval);
    snake = new Snake();
    food = new Food();
    food.pickLocation();
    score = 0;
    document.getElementById('score').innerText = 'Score: ' + score;

    interval = window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        food.draw();
        snake.update();
        snake.draw();

        if (snake.eat(food)) {
            score++;
            document.getElementById('score').innerText = 'Score: ' + score;
            food.pickLocation();
        }

        if (snake.checkCollision()) {
            clearInterval(interval);
            alert('Game Over! Your score: ' + score);
        }
    }, 250);
}

window.addEventListener('keydown', evt => {
    const direction = evt.key.replace('Arrow', '');
    snake.changeDirection(direction);
});

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.draw = function() {
        ctx.fillStyle = "#FFFFFF";

        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }

        ctx.fillRect(this.x, this.y, scale, scale);
    };

    this.update = function() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }

        this.tail[this.total - 1] = { x: this.x, y: this.y };

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x >= canvas.width || this.x < 0 || this.y >= canvas.height || this.y < 0) {
            this.total = 0;
            this.tail = [];
        }
    };

    this.changeDirection = function(direction) {
        switch (direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale * 1;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale * 1;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale * 1;
                    this.ySpeed = 0;
                }
                break;
        }
    };

    this.eat = function(food) {
        if (this.x === food.x && this.y === food.y) {
            this.total++;
            return true;
        }

        return false;
    };

    this.checkCollision = function() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                return true;
            }
        }

        if (this.x >= canvas.width || this.x < 0 || this.y >= canvas.height || this.y < 0) {
            return true;
        }

        return false;
    };
}

function Food() {
    this.x;
    this.y;

    this.pickLocation = function() {
        this.x = Math.floor(Math.random() * columns) * scale;
        this.y = Math.floor(Math.random() * rows) * scale;
    };

    this.draw = function() {
        ctx.fillStyle = "#4cafab";
        ctx.fillRect(this.x, this.y, scale, scale);
    };
}
