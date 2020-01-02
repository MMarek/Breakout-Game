const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");

// ramka obszaru roboczego
cvs.style.border = "1px solid blue";

// ramka paletki
ctx.lineWidth = 3;

// zmienne i stałe w grze
const paddle_width = 100;
const paddle_margin_bottom = 50;
const paddle_height = 20;
const ball_radius = 8;
let LIFE = 3; //gracz posiada 3 życia/możliwości nie odbicia piłeczki
let leftArrow = false;
let rightArrow = false;

// tworzenie paletki
const paddle = {
    x: cvs.width / 2 - paddle_width / 2,
    y: cvs.height - paddle_margin_bottom - paddle_height,
    width: paddle_width,
    height: paddle_height,
    dx: 5
};

// rysuj paletke
function drawPaddle() {
    ctx.fillStyle = "green";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "blue";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// kontrola paletki
document.addEventListener("keydown", function (event) {
    if (event.keyCode == 37) {
        leftArrow = true;
    } else if (event.keyCode == 39) {
        rightArrow = true;
    }
});
document.addEventListener("keyup", function (event) {
    if (event.keyCode == 37) {
        leftArrow = false;
    } else if (event.keyCode == 39) {
        rightArrow = false;
    }
});

// ruch paletki
function movePaddle() {
    if (rightArrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

// tworzenie piłeczki
const ball = {
    x: cvs.width / 2,
    y: paddle.y - ball_radius,
    radius: ball_radius,
    speed : 4,
    dx: 3 * (Math.random() * 2-1),
    dy: -3
};

// ryspwanie piłeczki
function drawBall() {
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.strokeStyle = "yellow";
    ctx.stroke();

    ctx.closePath();
}

// ruch piłeczki
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// detekcja kolizji piłeczki oraz ściany
function ballWallCollision() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    if(ball.y + ball.radius > cvs.height){
        LIFE -- ; //utrata życia
        resetBall();
    }
}
// funkcja restartu piłeczki
function resetBall() {
    ball.x = cvs.width/2;
    ball.y = paddle.y - ball.radius;
    ball.dx = 3 * (Math.random() * 2-1);
    ball.dy = -3
}
// funkcja kolizji piłeczki i paletki
function ballPaddleCollision() {
    if(ball.x < paddle.x + paddle.width
        && ball.x > paddle.x
        && paddle.y < paddle.y + paddle.height
        && ball.y > paddle.y){

        // sprawdz gdzie piłeczka uderzy paletke
        let collidePoint = ball.x - (paddle.x + paddle.width/2);

        //normalizacja wartości
        collidePoint = collidePoint / (paddle.width/2);

        // przeliczenie kąta piłeczki
        let angle = collidePoint * Math.PI/3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

// funkcja rysowania
function draw() {
    drawPaddle();
    drawBall();
}

// funkcja aktualizacji gry/ update
function update() {
    movePaddle();
    moveBall();
    ballWallCollision()
    ballPaddleCollision()
}

// pętla gry/loop
function loop() {
    ctx.drawImage(bg_img, 0, 0);
    draw();
    update();
    requestAnimationFrame(loop);
}

loop();