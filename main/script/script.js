// Get the canvas element
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const reloadButton = document.getElementById('reload-button');

/// Lấy chiều rộng và chiều cao của canvas
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

// Lấy chiều rộng và chiều cao của màn hình
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

// Tính toán vị trí trung tâm của màn hình
let centerX = (screenWidth - canvasWidth) / 2;
let centerY = (screenHeight - canvasHeight) / 2;

// Di chuyển canvas đến vị trí trung tâm
canvas.style.position = 'absolute';
canvas.style.top = centerY + 'px';
canvas.style.left = centerX + 'px';

// Define the bubble properties
const bubbleRadius = 30;
const bubbleColors = ['#ff69b4', '#33cc33', '#6666ff', '#ff9900', '#cc33cc'];

// Define the shooter properties
const shooterWidth = 50;
const shooterHeight = 10;
const shooterColor = '#ffff';

// Define the game variables
let bubbles = [];
let bullets = [];
let shooterX = canvas.width / 2;
let shooterY = canvas.height - shooterHeight - 20;
let score = 0;
let gameOver = false;
let victory = false;
let time = 30;


let bubbleImage = new Image();
bubbleImage.src = './asset/image/icon/bubble.png';

let shooterImage = new Image();
shooterImage.src = './asset/image/icon/amah_shadid.png';

let backgroundImage = new Image();
backgroundImage.src = './asset/image/1920x1080.jpg';

// Create initial bubbles
for (let i = 0; i < 10; i++) {
    bubbles.push({
        x: Math.random() * (canvas.width - bubbleRadius * 2) + bubbleRadius,
        y: Math.random() * (canvas.height / 2 - bubbleRadius * 2) + bubbleRadius,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
    });
}


// Thêm hàm để tạo đạn
function createBullet() {
    bullets.push({
        x: shooterX + shooterWidth / 2,
        y: shooterY,
        vx: 0,
        vy: -5,
        radius: 5,
    });
}

function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Draw the game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (victory) {
      // Vẽ màn hình chiến thắng
      if (backgroundImage.complete) {
        drawBackground();
        ctx.font = '48px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Victory!', canvas.width / 2, canvas.height / 2);
      } else {
        backgroundImage.onload = drawBackground;
      }
      reloadButton.style.display = 'block';
  } else if (!gameOver) {

    // Vẽ nền
  if (backgroundImage.complete) {
    drawBackground();
  } else {
    backgroundImage.onload = drawBackground;
  }

        // Draw the shooter
        ctx.fillStyle = shooterColor;
        ctx.fillRect(shooterX, shooterY, shooterWidth, shooterHeight);

        // Draw the bubbles
        for (let i = 0; i < bubbles.length; i++) {
          ctx.drawImage(bubbleImage, bubbles[i].x, bubbles[i].y, bubbleRadius * 2, bubbleRadius * 2);
        }
        // for (let i = 0; i < bubbles.length; i++) {
        //     ctx.fillStyle = bubbles[i].color;
        //     ctx.beginPath();
        //     ctx.arc(bubbles[i].x, bubbles[i].y, bubbleRadius, 0, 2 * Math.PI);
        //     ctx.fill();
        // }

        for (let i = 0; i < bullets.length; i++) {
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(bullets[i].x, bullets[i].y, bullets[i].radius, 0, 2 * Math.PI);
          ctx.fill();
      }

      // Vẽ thời gian
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Time: ${Math.floor(time)}`, 10, 10);

    // Vẽ điểm số
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Score: ${score}`, 10, 40);
    } else {
        // Draw the game over screen
        if (backgroundImage.complete) {
          drawBackground();
          ctx.font = '48px Arial';
        ctx.fillStyle = '#ffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        reloadButton.style.display = 'block';
        } else {
          backgroundImage.onload = drawBackground;
        }
    }
    
}

// Update the game state
function update() {
    if (!gameOver) {
        // Move the shooter
        if (shooterX < 0) {
            shooterX = 0;
        } else if (shooterX > canvas.width - shooterWidth) {
            shooterX = canvas.width - shooterWidth;
        }

        // Kiểm tra chiến thắng
    if (bubbles.length === 0) {
      victory = true;
      gameOver = false;
  }

  // Giảm thời gian
  time -= 1 / 60; // giảm 1 giây mỗi frame

  // Kiểm tra thời gian
  if (time <= 0) {
      // Thua cuộc
      gameOver = true;
      victory = false;
  }

        // Update the bubbles
for (let i = 0; i < bubbles.length; i++) {
  bubbles[i].x += bubbles[i].vx;
  bubbles[i].y += bubbles[i].vy;

  // Bounce off edges
  if (bubbles[i].x - bubbleRadius < 0 || bubbles[i].x + bubbleRadius > canvas.width) {
      bubbles[i].vx = -bubbles[i].vx;
  }
  if (bubbles[i].y - bubbleRadius < 0) {
      bubbles[i].vy = -bubbles[i].vy;
  }
  if (bubbles[i].y + bubbleRadius > canvas.height) {
      bubbles[i].vy = -bubbles[i].vy;
  }
}

        // Xử lý va chạm giữa bong bóng
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
          let distance = Math.sqrt((bubbles[i].x - bubbles[j].x) ** 2 + (bubbles[i].y - bubbles[j].y) ** 2);
      }
  }
        // // Check for collisions between the shooter and bubbles
        // for (let i = 0; i < bubbles.length; i++) {
        //     if (checkCollision(shooterX, shooterY, bubbles[i].x, bubbles[i].y)) {
        //         // Break the bubble
        //         let distance = Math.sqrt((bubbles[i].x - shooter.x) ** 2 + (bubbles[i].y - shooter.y) ** 2);
        // if (distance < bubbleRadius + shooter.radius) {
        //     // Bong bóng đi qua shooter
        //     bubbles[i].vx = -bubbles[i].vx;
        //     bubbles[i].vy = -bubbles[i].vy;
        // }
        //     }
        // }

        // Cập nhật vị trí đạn
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].x += bullets[i].vx;
      bullets[i].y += bullets[i].vy;

      // Kiểm tra va chạm với bong bóng
      for (let j = 0; j < bubbles.length; j++) {
          let distance = Math.sqrt((bullets[i].x - bubbles[j].x) ** 2 + (bullets[i].y - bubbles[j].y) ** 2);
          if (distance < bubbleRadius + bullets[i].radius) {
              // Vỡ bong bóng
              bubbles.splice(j, 1);
              // Tăng điểm số
              score++;
              // Xóa đạn
              bullets.splice(i, 1);
              i--;
              break;
          }
      }

      // Kiểm tra va chạm với cạnh trên
      if (bullets[i].y - bullets[i].radius < 0) {
          // Xóa đạn
          bullets.splice(i, 1);
          i--;
      }
    }
    }
}

// Check for collisions between two objects
function checkCollision(x1, y1, x2, y2) {
    const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

    return distance < bubbleRadius * 2;
}


// Handle user input
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        shooterX -= 10;
    } else if (e.key === 'ArrowRight') {
        shooterX += 10;
    } else if (e.key === ' ') {
        // Shoot a bubble
        // bubbles.push({
        //     x: shooterX + shooterWidth / 2,
        //     y: shooterY,
        //     vx: 0,
        //     vy: -2,
        //     color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
        // });
        createBullet();
    }
});

// Handle reload button click
reloadButton.addEventListener('click', () => {
    // Reset the game state
    gameOver = false;
    victory = false
    score = 0;
    time = 20;
    shooterX = canvas.width / 2;
    shooterY = canvas.height - shooterHeight - 20;
    bubbles = [];
    for (let i = 0; i < 10; i++) {
        bubbles.push({
            x: Math.random() * (canvas.width - bubbleRadius * 2) + bubbleRadius,
            y: Math.random() * (canvas.height / 2 - bubbleRadius * 2) + bubbleRadius,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1,
            color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
        });
    }
    reloadButton.style.display = 'none';
});

// Main game loop
setInterval(() => {
    update();
    draw();
}, 16);