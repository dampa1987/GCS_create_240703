// ゲーム設定
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ゲーム状態
let gameState = {
    running: false,
    score: 0,
    lives: 3,
    level: 1
};

// プレイヤー
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 30,
    speed: 5,
    color: '#00ff00'
};

// 弾
let bullets = [];
const bulletSpeed = 7;
const bulletWidth = 4;
const bulletHeight = 15;

// インベーダー
let invaders = [];
const invaderRows = 4;
const invaderCols = 8;
const invaderWidth = 40;
const invaderHeight = 30;
const invaderPadding = 10;
const invaderOffsetTop = 50;
const invaderOffsetLeft = 60;
let invaderDirection = 1;
let invaderSpeed = 1;
let invaderDropDistance = 20;

// 敵の弾
let enemyBullets = [];
const enemyBulletSpeed = 3;

// キー入力
const keys = {
    left: false,
    right: false,
    space: false
};

// インベーダーを初期化
function initInvaders() {
    invaders = [];
    for (let row = 0; row < invaderRows; row++) {
        for (let col = 0; col < invaderCols; col++) {
            invaders.push({
                x: invaderOffsetLeft + col * (invaderWidth + invaderPadding),
                y: invaderOffsetTop + row * (invaderHeight + invaderPadding),
                width: invaderWidth,
                height: invaderHeight,
                alive: true,
                type: row
            });
        }
    }
}

// ゲーム開始
function startGame() {
    gameState.running = true;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;
    bullets = [];
    enemyBullets = [];
    player.x = canvas.width / 2 - 25;
    initInvaders();
    updateDisplay();
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    gameLoop();
}

// プレイヤーを描画
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // 砲塔
    ctx.fillRect(player.x + player.width / 2 - 5, player.y - 10, 10, 10);
}

// インベーダーを描画
function drawInvaders() {
    invaders.forEach(invader => {
        if (invader.alive) {
            // インベーダーのタイプによって色を変える
            const colors = ['#ff0000', '#ff6600', '#ffff00', '#ff00ff'];
            ctx.fillStyle = colors[invader.type];

            // シンプルなインベーダーの形
            ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
            ctx.fillStyle = '#000000';
            ctx.fillRect(invader.x + 10, invader.y + 8, 8, 8);
            ctx.fillRect(invader.x + 22, invader.y + 8, 8, 8);
        }
    });
}

// 弾を描画
function drawBullets() {
    ctx.fillStyle = '#ffffff';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    });

    ctx.fillStyle = '#ff0000';
    enemyBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    });
}

// プレイヤーを更新
function updatePlayer() {
    if (keys.left && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.right && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

// 弾を更新
function updateBullets() {
    // プレイヤーの弾
    bullets = bullets.filter(bullet => {
        bullet.y -= bulletSpeed;
        return bullet.y > 0;
    });

    // 敵の弾
    enemyBullets = enemyBullets.filter(bullet => {
        bullet.y += enemyBulletSpeed;
        return bullet.y < canvas.height;
    });
}

// インベーダーを更新
function updateInvaders() {
    let hitEdge = false;

    invaders.forEach(invader => {
        if (invader.alive) {
            invader.x += invaderSpeed * invaderDirection;

            if (invader.x <= 0 || invader.x + invader.width >= canvas.width) {
                hitEdge = true;
            }
        }
    });

    if (hitEdge) {
        invaderDirection *= -1;
        invaders.forEach(invader => {
            if (invader.alive) {
                invader.y += invaderDropDistance;
            }
        });
    }

    // ランダムに敵が射撃
    if (Math.random() < 0.02) {
        const aliveInvaders = invaders.filter(inv => inv.alive);
        if (aliveInvaders.length > 0) {
            const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
            enemyBullets.push({
                x: shooter.x + shooter.width / 2,
                y: shooter.y + shooter.height
            });
        }
    }
}

// 衝突判定
function checkCollisions() {
    // 弾とインベーダーの衝突
    bullets.forEach((bullet, bulletIndex) => {
        invaders.forEach(invader => {
            if (invader.alive &&
                bullet.x < invader.x + invader.width &&
                bullet.x + bulletWidth > invader.x &&
                bullet.y < invader.y + invader.height &&
                bullet.y + bulletHeight > invader.y) {

                invader.alive = false;
                bullets.splice(bulletIndex, 1);
                gameState.score += (4 - invader.type) * 10;
                updateDisplay();
            }
        });
    });

    // 敵の弾とプレイヤーの衝突
    enemyBullets.forEach((bullet, index) => {
        if (bullet.x < player.x + player.width &&
            bullet.x + bulletWidth > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bulletHeight > player.y) {

            enemyBullets.splice(index, 1);
            gameState.lives--;
            updateDisplay();

            if (gameState.lives <= 0) {
                gameOver();
            }
        }
    });

    // インベーダーがプレイヤーに到達
    invaders.forEach(invader => {
        if (invader.alive && invader.y + invader.height >= player.y) {
            gameOver();
        }
    });

    // すべてのインベーダーを倒した
    if (invaders.every(inv => !inv.alive)) {
        nextLevel();
    }
}

// 次のレベル
function nextLevel() {
    gameState.level++;
    invaderSpeed += 0.5;
    initInvaders();
}

// ゲームオーバー
function gameOver() {
    gameState.running = false;
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('restartButton').style.display = 'inline-block';
}

// 表示を更新
function updateDisplay() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('lives').textContent = gameState.lives;
}

// 描画
function draw() {
    // 背景
    ctx.fillStyle = '#000033';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 星を描画
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
        const x = (i * 137) % canvas.width;
        const y = (i * 197) % canvas.height;
        ctx.fillRect(x, y, 2, 2);
    }

    drawPlayer();
    drawInvaders();
    drawBullets();
}

// ゲームループ
function gameLoop() {
    if (!gameState.running) return;

    updatePlayer();
    updateBullets();
    updateInvaders();
    checkCollisions();
    draw();

    requestAnimationFrame(gameLoop);
}

// キーボードイベント
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === ' ' && gameState.running) {
        e.preventDefault();
        if (!keys.space) {
            bullets.push({
                x: player.x + player.width / 2 - bulletWidth / 2,
                y: player.y
            });
            keys.space = true;
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === ' ') keys.space = false;
});

// ボタンイベント
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', startGame);

// 初期描画
draw();
