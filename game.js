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
let score = 0;
const score_unit = 10;
let level = 1;
const max_level = 3;
let game_over = false;
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
    speed: 4,
    dx: 3 * (Math.random() * 2 - 1),
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
        wall_hit.play();
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
        wall_hit.play();
    }
    if (ball.y + ball.radius > cvs.height) {
        LIFE--; //utrata życia
        life_lost.play()
        resetBall();
    }
}

// funkcja restartu piłeczki
function resetBall() {
    ball.x = cvs.width / 2;
    ball.y = paddle.y - ball.radius;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3
}

// funkcja kolizji piłeczki i paletki
function ballPaddleCollision() {
    if (ball.x < paddle.x + paddle.width
        && ball.x > paddle.x
        && paddle.y < paddle.y + paddle.height
        && ball.y > paddle.y) {

        // dzwiek
        paddle_hit.play();

        // sprawdz gdzie piłeczka uderzy paletke
        let collidePoint = ball.x - (paddle.x + paddle.width / 2);

        //normalizacja wartości
        collidePoint = collidePoint / (paddle.width / 2);

        // przeliczenie kąta piłeczki
        let angle = collidePoint * Math.PI / 3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
}

// tworzenie klocków
const brick = {
    row: 1,
    column: 5,
    width: 55,
    height: 20,
    offsetLeft: 20,
    offsetTop: 20,
    marginTop: 40,
    fillColor: "black",
    strokeColor: "#FFF"
};

let bricks = [];

function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offsetLeft + brick.width) + brick.offsetLeft,
                y: r * (brick.offsetTop + brick.height) + brick.offsetTop + brick.marginTop,
                status: true
            }
        }
    }
}

createBricks();

// rysuj klocki
function drawBricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            // jezeli klocek nie jest uszkodzony
            if (b.status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

// kolizja relacji piłka-klocek
function ballBrickCollision() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            // jezeli klocek nie jest uszkodzony
            if (b.status) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width &&
                    ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
                    brick_hit.play();
                    ball.dy = -ball.dy;
                    b.status = false; //gdy klocek zostanie uszkodzony
                    score += score_unit;
                }
            }
        }
    }
}

// pokaż statystyki gry
function showGameStats(text, textX, textY, img, imgX, imgY) {
    // rysuj text
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Germanin One";
    ctx.fillText(text, textX, textY);

    // rysuj img
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);

}

// funkcja rysowania
function draw() {
    drawPaddle();
    drawBall();
    drawBricks();

    // pokaż punktacje
    showGameStats(score, 35, 25, score_img, 5, 5);
    // pokaż życia
    showGameStats(LIFE, cvs.width - 25, 25, life_img, cvs.width - 55, 5);
    // pokaż poziom
    showGameStats(level, cvs.width / 2, 25, level_img, cvs.width / 2 - 30, 5);
}

// koniec gry
function gameOver() {
    if (LIFE <= 0) {
        game_over = true;
    }
}

// poziom wyżej
function levelUp() {
    let isLevelDone = true;

    // sprawdz czy wszystkie klocki są zbite/uszkodzone
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            isLevelDone = isLevelDone && !bricks[r][c].status;
        }
    }

    if (isLevelDone) {
        win.play();
        if (level >= max_level) {
            game_over = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall();
        level++;
    }
}

// funkcja aktualizacji gry/ update
function update() {
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();
    gameOver();
    levelUp();
}

// pętla gry/loop
function loop() {
    ctx.drawImage(bg_img, 0, 0);
    draw();
    update();

    if (!game_over) {
        webkitRequestAnimationFrame(loop);
    }
}

loop();

// wybierz elem. dzwięku
const soundElement = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager() {
// zmień img dzwięku z ON na OFF
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_ON = imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";

    soundElement.setAttribute("src", SOUND_IMG); //??

// załącz i wyłącz dzwiek
    wall_hit.muted = wall_hit.muted ? false : true;
    paddle_hit.muted = paddle_hit.muted ? false : true;
    brick_hit.muted = brick_hit.muted ? false : true;
    win.muted = win.muted ? false : true;
    life_lost.muted = life_lost.muted ? false : true;
}