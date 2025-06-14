// Отримуємо елементи DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');
const instructionsBtn = document.getElementById('instructions-btn');
const levelCompleteElement = document.getElementById('level-complete');
const nextLevelBtn = document.getElementById('next-level-btn');

// Розміри ігрового поля
canvas.width = 800;
canvas.height = 500;

// Змінні гри
let score = 0;
let lives = 3;
let level = 1;
let gameRunning = false;
let bricks = [];
let ball = {};
let paddle = {};
let rightPressed = false;
let leftPressed = false;

// Кольори для цеглинок
const brickColors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];

// Ініціалізація гри
function initGame() {
    // Платформа
    paddle = {
        x: canvas.width / 2 - 50,
        y: canvas.height - 20,
        width: 100,
        height: 15,
        speed: 8
    };

    // М'яч
    ball = {
        x: canvas.width / 2,
        y: canvas.height - 40,
        radius: 10,
        dx: 5,
        dy: -5,
        speed: 5
    };

    // Створення цеглинок
    createBricks();
}

// Створення цеглинок
function createBricks() {
    bricks = [];
    const brickRowCount = 3 + level;
    const brickColumnCount = 8;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 60;
    const brickOffsetLeft = 30;

    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            const brickColor = brickColors[r % brickColors.length];
            
            bricks.push({
                x: brickX,
                y: brickY,
                width: brickWidth,
                height: brickHeight,
                color: brickColor,
                visible: true
            });
        }
    }
}

// Малювання платформи
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#2c3e50';
    ctx.fill();
    ctx.closePath();
}

// Малювання м'яча
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.closePath();
}

// Малювання цеглинок
function drawBricks() {
    bricks.forEach(brick => {
        if (brick.visible) {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.width, brick.height);
            ctx.fillStyle = brick.color;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
            ctx.closePath();
        }
    });
}

// Перевірка зіткнення м'яча з цеглинками
function collisionDetection() {
    bricks.forEach(brick => {
        if (brick.visible) {
            if (
                ball.x > brick.x &&
                ball.x < brick.x + brick.width &&
                ball.y > brick.y &&
                ball.y < brick.y + brick.height
            ) {
                ball.dy = -ball.dy;
                brick.visible = false;
                score += 10;
                scoreElement.textContent = `Рахунок: ${score}`;
                
                // Перевірка чи всі цеглинки знищені
                if (bricks.every(b => !b.visible)) {
                    levelComplete();
                }
            }
        }
    });
}

// Перевірка зіткнення м'яча з платформою
function paddleCollision() {
    if (
        ball.y + ball.radius > paddle.y &&
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        // Зміна напрямку в залежності від того, в яку частину платформи вдарився м'яч
        const hitPosition = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        const angle = hitPosition * Math.PI / 3; // Максимальний кут 60 градусів
        
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
}

// Оновлення позиції м'яча
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Відбиття від стін
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    
    // Відбиття від верхньої стінки
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    
    // Перевірка чи м'яч вилетів за межі (промах)
    if (ball.y + ball.radius > canvas.height) {
        lives--;
        livesElement.textContent = `Життя: ${lives}`;
        
        if (lives <= 0) {
            gameOver();
        } else {
            resetBall();
        }
    }
}

// Скидання м'яча після промаху
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 40;
    ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -5;
    paddle.x = canvas.width / 2 - 50;
}

// Оновлення позиції платформи
function updatePaddle() {
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }
}

// Малювання гри
function draw() {
    // Очищення поля
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Малювання елементів
    drawBricks();
    drawBall();
    drawPaddle();
    
    // Виведення рівня
    ctx.font = '20px Arial';
    ctx.fillStyle = '#2c3e50';
    ctx.fillText(`Рівень: ${level}`, 20, 30);
}

// Оновлення стану гри
function update() {
    updatePaddle();
    updateBall();
    collisionDetection();
    paddleCollision();
    draw();
    
    if (gameRunning) {
        requestAnimationFrame(update);
    }
}

// Завершення гри
function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = `Ваш рахунок: ${score}`;
    gameOverElement.style.display = 'block';
}

// Завершення рівня
function levelComplete() {
    gameRunning = false;
    levelCompleteElement.style.display = 'block';
}

// Початок гри
function startGame() {
    gameRunning = true;
    score = 0;
    lives = 3;
    level = 1;
    scoreElement.textContent = `Рахунок: ${score}`;
    livesElement.textContent = `Життя: ${lives}`;
    gameOverElement.style.display = 'none';
    levelCompleteElement.style.display = 'none';
    initGame();
    update();
}

// Наступний рівень
function nextLevel() {
    level++;
    gameRunning = true;
    levelCompleteElement.style.display = 'none';
    initGame();
    update();
}

// Обробники подій клавіатури
document.addEventListener('keydown', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
});

// Обробники кнопок
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
nextLevelBtn.addEventListener('click', nextLevel);
instructionsBtn.addEventListener('click', () => {
    window.location.href = 'index1.html';
});
// Отримуємо кнопку повернення в меню
const backToMenuBtn = document.getElementById('back-to-menu');

backToMenuBtn.addEventListener('click', () => {
    window.location.href = 'index1.html';
});
// Ініціалізація при завантаженні
initGame();
