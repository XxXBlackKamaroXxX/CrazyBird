//Создание канваса

const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

width = cvs.width = window.innerWidth;
height = cvs.height = window.innerHeight;

//Игровые объекты

let bird = new Image();
bird.src = "js/img/bird.png";

let pipeDown = new Image();
pipeDown.src = "js/img/pipeDown.png";

let pipeUp = new Image();
pipeUp.src = "js/img/pipeUp.png";

//Аудиофайлы

let beginAudio = new Audio();
beginAudio.src = "js/audio/gameOn.mp3";

let fly = new Audio();
fly.src = "js/audio/fly.mp3";

let scoreAudioFirst = new Audio();
scoreAudioFirst.src = "js/audio/scorePlusFirst.mp3";

let scoreAudioSecond = new Audio();
scoreAudioSecond.src = "js/audio/scorePlusSecond.mp3";

let scoreAudioThird = new Audio();
scoreAudioThird.src = "js/audio/scorePlusThird.mp3";

let endAudio = new Audio();
endAudio.src = "js/audio/gameOver.mp3";


//Игровые переменные

let gameOn = true;
let birdWidth = 121;
let birdHeight = 121;
let birdX = 150;
let birdY = 150;
let birdMove = 21;
let grav = 1.3;
let score = 0;
let scoreTracks = [scoreAudioFirst, scoreAudioSecond, scoreAudioThird];
let gap = 80;
let pipe = [];
let pipeWidth = 228;
let pipeHeight = 777;
let pipeYPos = -333;
let pipeAdd = 777;
let deathRangeX = 20;
let deathRangeY = 40;

pipe[0] = {
    x: width, 
    y: pipeYPos
}

if  (height < 450 && width < 1000) {
    birdWidth = 35;
    birdHeight = 35;
    birdMove = 11;
    grav = 0.5;
    gap = 25;
    pipeWidth = 150;
    pipeHeight = 250;
    pipeYPos = -75;
    pipeAdd = 410;
    deathRangeX = 13;
    deathRangeY = 15;
    pipe[0] = {
        x: width,
        y: pipeYPos
    }
}

else if (height < 1000 && width < 450) {
    birdY = 425;
    birdWidth = 35;
    birdHeight = 35;
    birdMove = 21;
    grav = 1.0;
    gap = 16;
    pipeWidth = 110;
    pipeHeight = 550;
    pipeYPos = -125;
    pipeAdd = 310;
    deathRangeX = 13;
    deathRangeY = 27;
    pipe[0] = {
        x: width,
        y: pipeYPos
    }
}

//Движение птички

//Клавиатура

document.onkeydown = function(event) {
    if(event.keyCode == 32) {
        fly.play();
    }
}

document.onkeyup = function(event) {
    if(event.keyCode == 32) {
        fly.play();
        birdY -= birdMove;
    }
}

//Мышь

document.onclick = function() {
    fly.play();
    birdY -= birdMove;
}

//Касания

var ongoingTouches = [];
function copyTouch({ identifier, pageX, pageY }) {
    return { identifier, pageX, pageY };
}
cvs.ontouchstart = function (event) {
    event.preventDefault();
    var touches = event.changedTouches;
    ongoingTouches.push(copyTouch(touches[0]));
}
cvs.ontouchend = function (ev) {
    ev.preventDefault();
    var touches = ev.changedTouches;
    if(ev) {
        fly.play();
        birdY -= birdMove;
    }
    for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            ongoingTouches.splice(idx, 1); 
        }
    }
}
cvs.ontouchcancel = function (et) {
    et.preventDefault();
    var touches = et.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);
        ongoingTouches.splice(idx, 1); 
    }
}        
function ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < ongoingTouches.length; i++) {
        var id = ongoingTouches[i].identifier;
        if (id == idToFind) {
            return i;
        }
    }
    return -1; 
}

//Рисование

function draw() {
    ctx.clearRect(0, 0, width, height);

    if (gameOn) {
        beginAudio.play();
        if (!beginAudio.paused) {
            gameOn = false;
        }
    }

    for (let i = 0; i < pipe.length; i++) {
        ctx.drawImage(pipeDown, pipe[i].x, pipe[i].y, pipeWidth, pipeHeight);
        ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y + pipeHeight + gap, pipeWidth, pipeHeight);

        pipe[i].x--;

        if (pipe[i].x + pipeAdd == width) {
            pipe.push ({
                x: width,
                y: Math.floor(Math.random() * (pipeYPos + 0)) + 0
            });
        }

        if ((birdX + birdWidth - deathRangeX) >= pipe[i].x && birdX <= (pipe[i].x + pipeWidth) && (birdY <= (pipe[i].y + pipeHeight - deathRangeY) || (birdY + birdHeight) >= (pipe[i].y + pipeHeight + gap + deathRangeY)) || (birdY + birdHeight) >= height) {
           clearInterval(mainInterval);
           endAudio.play();
           setInterval(() => {
               endGame();
           }, 1000);
        }

        if (pipe[i].x == -46) {
            score++;
            let rand = parseInt(Math.random() * 1000) % 3;
            scoreTracks[rand].play();
        }

    
    }
    ctx.drawImage(bird, birdX, birdY, birdWidth, birdHeight);
    birdY += grav;

    ctx.fillStyle = "#000";
    ctx.font = "47px Impact";
    ctx.fillText("Счет: " + score, 10, 51);
}

//Вызов функции отрисовки

let mainInterval = setInterval(() => {
    draw()
}, 10);

//Конец игры

function endGame() {
    location.reload();
}