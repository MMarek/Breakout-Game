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
    if(event.keyCode == 37){
        leftArrow = true;
    }else if(event.keyCode == 39){
        rightArrow = true;
    }
});
document.addEventListener("keyup", function (event) {
    if(event.keyCode == 37){
        leftArrow = false;
    }else if(event.keyCode == 39){
        rightArrow = false;
    }
});
// ruch paletki
function movePaddle() {
    if(rightArrow && paddle.x + paddle.width){
        paddle.x += paddle.dx;
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}
// tworzenie piłeczki
const ball = {
x : cvs.width/2,
    y : paddle.y - ball_radius,
    radius : ball_radius,
    dx : 3,
    dy : -3
};
// ryspwanie piłeczki
function drawBall() {
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball, radius, 0, Math.PI*2);
    ctx.fillStyle = ""
}

// funkcja rysowania
function draw() {
    drawPaddle();
}

// funkcja aktualizacji gry/ update
function update() {
movePaddle()
}

// pętla gry/loop
function loop() {
    ctx.drawImage(bg_img,0,0 );
    draw();
    update();
    requestAnimationFrame(loop);
}

loop()