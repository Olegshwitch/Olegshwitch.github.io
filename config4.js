// Константи та змінні
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const otherPageBtn = document.getElementById('other-page-btn');

const BOX_SIZE = 20;
const ROWS = canvas.height / BOX_SIZE;
const COLS = canvas.width / BOX_SIZE;

let snake = [];
let direction = null;
let food = null;
let score = 0;
let gameInterval = null;

// Ініціалізація гри
function initGame() {
    canvas.width = 400;
    canvas.height = 400;
    initSnake();
    generateFood();
    direction = 'RIGHT';
    score = 0;
    scoreElement.textContent = `Рахунок: ${score}`;
    gameOverElement.style.display = 'none';
}

// Початковий стан змійки
function initSnake() {
    snake = [
        { x: 5 * BOX_SIZE, y: 5 * BOX_SIZE },
        { x: 4 * BOX_SIZE, y: 5 * BOX_SIZE },
        { x: 3 * BOX_SIZE, y: 5 * BOX_SIZE }
    ];
}

// Генерація їжі
function generateFood() {
    food = {
        x: Math.floor(Math.random() * COLS) * BOX_SIZE,
        y: Math.floor(Math.random() * ROWS) * BOX_SIZE
    };

    // Перевірка, щоб їжа не з'явилася на змійці
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            return generateFood();
        }
    }
}

// Малювання гри
function draw() {
    // Очищення поля
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Малювання змійки
    ctx.fillStyle = '#2ecc71';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, BOX_SIZE, BOX_SIZE);
        ctx.strokeStyle = '#27ae60';
        ctx.strokeRect(segment.x, segment.y, BOX_SIZE, BOX_SIZE);
    });

    // Малювання їжі
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(food.x + BOX_SIZE / 2, food.y + BOX_SIZE / 2, BOX_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Оновлення стану гри
function update() {
    const head = { x: snake[0].x, y: snake[0].y };

    // Рух голови
    switch (direction) {
        case 'LEFT': head.x -= BOX_SIZE; break;
        case 'UP': head.y -= BOX_SIZE; break;
        case 'RIGHT': head.x += BOX_SIZE; break;
        case 'DOWN': head.y += BOX_SIZE; break;
    }

    snake.unshift(head);

    // Перевірка на з'їдання їжі
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        scoreElement.textContent = `Рахунок: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }

    // Перевірка на зіткнення
    if (
        head.x < 0 || head.y < 0 ||
        head.x >= canvas.width || head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver();
    }
}

// Завершення гри
function gameOver() {
    clearInterval(gameInterval);
    finalScoreElement.textContent = `Рахунок: ${score}`;
    gameOverElement.style.display = 'block';
}

// Початок гри
function startGame() {
    initGame();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        update();
        draw();
    }, 150);
}

// Обробка клавіш
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft': if (direction !== 'RIGHT') direction = 'LEFT'; break;
        case 'ArrowUp': if (direction !== 'DOWN') direction = 'UP'; break;
        case 'ArrowRight': if (direction !== 'LEFT') direction = 'RIGHT'; break;
        case 'ArrowDown': if (direction !== 'UP') direction = 'DOWN'; break;
    }
});

// Рестарт гри
restartBtn.addEventListener('click', startGame);

// Перехід на іншу сторінку
otherPageBtn.addEventListener('click', () => {
    window.location.href = 'index1.html';
});

// Запуск гри при завантаженні
window.addEventListener('load', startGame);
