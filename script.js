const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    speed: 5,
    draw: function() {
        // Draw player body
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        // Draw player eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 3, this.y + this.height / 3, 5, 0, Math.PI * 2);
        ctx.arc(this.x + (2 * this.width / 3), this.y + this.height / 3, 5, 0, Math.PI * 2);
        ctx.fill();
        // Draw player hand
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.arc(this.x + this.width, this.y + this.height / 2, 10, 0, Math.PI * 2);
        ctx.fill();
    },
    update: function() {
        if (keys['ArrowUp'] && this.y > 0) {
            this.y -= this.speed;
        }
        if (keys['ArrowDown'] && this.y < canvas.height - this.height) {
            this.y += this.speed;
        }
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x < canvas.width - this.width) {
            this.x += this.speed;
        }
    }
};

const projectiles = [];
let lastShotTime = 0;
const shotCooldown = 400; // 400ms cooldown

function Projectile(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10,
    this.height = 5,
    this.speed = 10,
    this.draw = function() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    this.update = function() {
        this.x += this.speed;
    }
}

const boss = {
    x: 700,
    y: 200,
    width: 100,
    height: 100,
    health: 200,
    draw: function() {
        // Draw boss body
        ctx.fillStyle = '#8A2BE2';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        // Draw boss eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 3, this.y + this.height / 3, 10, 0, Math.PI * 2);
        ctx.arc(this.x + (2 * this.width / 3), this.y + this.height / 3, 10, 0, Math.PI * 2);
        ctx.fill();
        // Draw health bar
        ctx.fillStyle = 'grey';
        ctx.fillRect(this.x - 10, this.y - 20, this.width + 20, 10);
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 10, this.y - 20, (this.width + 20) * (this.health / 200), 10);
    },
    update: function() {
        // Basic AI: Move up and down with occasional stops
        if (this.stopTimer > 0) {
            this.stopTimer--;
            return;
        }
        if (this.y <= 0 || this.y >= canvas.height - this.height) {
            this.speed = -this.speed;
        }
        this.y += this.speed;
        if (Math.random() < 0.01) { // 1% chance to stop each frame
            this.stopTimer = 60; // Stop for 1 second (60 frames)
        }
    },
    speed: 2,
    stopTimer: 0,
};

const keys = {};

function checkCollision(projectile, boss) {
    return projectile.x < boss.x + boss.width &&
           projectile.x + projectile.width > boss.x &&
           projectile.y < boss.y + boss.height &&
           projectile.y + projectile.height > boss.y;
}

function restartGame() {
    boss.health = 200;
    projectiles.length = 0;
    gameLoop();
}

document.addEventListener('keydown', function(e) {
    keys[e.key] = true;
    if (e.key === ' ' && Date.now() - lastShotTime > shotCooldown) {
        projectiles.push(new Projectile(player.x + player.width, player.y + player.height / 2));
        lastShotTime = Date.now();
    }
    if (e.key === 'r') {
        restartGame();
    }
});

document.addEventListener('keyup', function(e) {
    keys[e.key] = false;
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    player.draw();
    projectiles.forEach((projectile, index) => {
        projectile.update();
        projectile.draw();
        if (checkCollision(projectile, boss)) {
            projectiles.splice(index, 1);
            boss.health -= 10;
        }
    });
    boss.update();
    boss.draw();
    if (boss.health <= 0) {
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('You Won! Press R to restart', canvas.width / 2, canvas.height / 2);
        return;
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
