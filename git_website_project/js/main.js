let mouseUse = false;
let keyboardUse = false;
let touchUse = false;
let highScore = 0;
localStorage.setItem('scoreHigh', highScore);
let end = false;

const fly = new Audio();
fly.src = "js/audio/fly.mp3";

const endAudio = new Audio();
endAudio.src = "js/audio/gameOver.mp3";

function game() {
    //Создание канваса

    const cvs = document.getElementById("canvas");
    const ctx = cvs.getContext("2d");

    width = cvs.width = window.innerWidth;
    height = cvs.height = window.innerHeight;

    //Игровые объекты

    const bird = new Image();
    bird.src = "js/img/bird.png";

    const pipeDown = new Image();
    pipeDown.src = "js/img/pipeDown.png";

    const pipeUp = new Image();
    pipeUp.src = "js/img/pipeUp.png";

    //Аудиофайлы

    const beginAudio = new Audio();
    beginAudio.src = "js/audio/gameOn.mp3";

    const scoreAudioFirst = new Audio();
    scoreAudioFirst.src = "js/audio/scorePlusFirst.mp3";

    const scoreAudioSecond = new Audio();
    scoreAudioSecond.src = "js/audio/scorePlusSecond.mp3";

    const scoreAudioThird = new Audio();
    scoreAudioThird.src = "js/audio/scorePlusThird.mp3";

    //Игровые переменные

    let gameOn = true;
    let scoreTracks = [scoreAudioFirst, scoreAudioSecond, scoreAudioThird];
    let birdWidth = 111;
    let birdHeight = 111;
    let birdX = 150;
    let birdY = 150;
    let birdMove = 50;
    let grav = 2.3;
    let score = 0;

    let pipe = [];
    let pipeWidth = Math.floor(Math.random() * (228 + 111)) + 111;
    let pipeHeight = 0.777 * height;
    let pipeYPos = -0.333 * height;
    let pipeAdd = Math.floor(Math.random() * (777 + 333)) + 333;
    let deathRangeX = 20;
    let deathRangeY = 40;
    ctx.font = "47px Impact";

    pipe[0] = {
        x: width, 
        y: pipeYPos,
        pipeW: pipeWidth,
        pipeA: pipeAdd
    }

    if  (height < 450 && width < 1000) {
        birdWidth = 35;
        birdHeight = 35;
        birdMove = 27;
        grav = 1.1;
        pipeWidth = Math.floor(Math.random() * (150 + 90)) + 90;
        pipeHeight = 0.777 * height;
        pipeYPos = -0.333 * height;
        pipeAdd = Math.floor(Math.random() * (444 + 50)) + 50;
        deathRangeX = 13;
        deathRangeY = 15;
        ctx.font = "35px Impact";
        pipe[0] = {
            x: width, 
            y: pipeYPos,
            pipeW: pipeWidth,
            pipeA: pipeAdd
        }
    }

    else if (height < 1000 && width < 450) {
        birdY = 325;
        birdWidth = 40;
        birdHeight = 40;
        birdMove = 35;
        grav = 1.5;
        pipeWidth = Math.floor(Math.random() * (110 + 60)) + 60;
        pipeHeight = 0.777 * height;
        pipeYPos = -0.333 * height;
        pipeAdd = Math.floor(Math.random() * (250 + 150)) + 150;
        deathRangeX = 13;
        deathRangeY = 27;
        ctx.font = "35px Impact";
        pipe[0] = {
            x: width, 
            y: pipeYPos,
            pipeW: pipeWidth,
            pipeA: pipeAdd
        }
    }

    let gap = birdHeight * 1.7;

    //Движение птички

    //Клавиатура
    if (keyboardUse == true) {
        document.onkeydown = function(event) {
            if(event.keyCode == 32) {
                fly.play();
                birdY -= birdMove;
            }
        }
    }

    //Мышь

    if (mouseUse == true) {
        document.onmousedown = function() {
            fly.play();
            birdY -= birdMove;
        }
        
    }
    //Касания

    if (touchUse == true) {
        var ongoingTouches = [];
        cvs.ontouchstart = function (event) {
            event.preventDefault();
            var touches = event.changedTouches;
            ongoingTouches.push(touches[0]);
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
    
    }
    
    //Рисование

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Музыка в начале игры

        if (gameOn) {
            beginAudio.play();
            if (!beginAudio.paused) {
                gameOn = false;
            }
        }

        // Ход игры

        for (let i = 0; i < pipe.length; i++) {


            // Отрисовка труб

            ctx.drawImage(pipeDown, pipe[i].x, pipe[i].y, pipe[i].pipeW, pipeHeight);
            ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y + pipeHeight + gap, pipe[i].pipeW, pipeHeight);


            // Добавление труб и их движение

            pipe[i].x -= 2;

            if (pipe[i].x + pipe[i].pipeW + 150 == (width - pipe[i].pipeW * 3)) {
                pipe.push ({
                    x: width,
                    y: Math.floor(Math.random() * (pipeYPos + 0)) + 0,
                    pipeW: Math.floor(Math.random() * (width / 10 + 10)) + 10,
                    pipeA: Math.floor(Math.random() * (220 + (birdWidth + 80))) + (birdWidth + 80)
                });
            }

            
            // Если птичка врезалась в трубу

            if ((birdX + birdWidth - deathRangeX) >= pipe[i].x && birdX <= (pipe[i].x + pipe[i].pipeW) && (birdY <= (pipe[i].y + pipeHeight - deathRangeY) || (birdY + birdHeight) >= (pipe[i].y + pipeHeight + gap + deathRangeY)) || (birdY + birdHeight) >= height) {
                if (highScore < score) {
                    highScore = score;
                }
                if (localStorage.getItem('scoreHigh', highScore) < highScore) {
                    localStorage.removeItem('scoreHigh');
                    localStorage.setItem('scoreHigh', highScore);
                }
                clearInterval(mainInterval);
                end = true;
                showMenu();
            }


            // Действия при пролете трубы

            if (pipe[i].x + pipe[i].pipeW + 1 == birdX || pipe[i].x + pipe[i].pipeW + 2 == birdX ) {
                score++;
                ctx.fillStyle = "#000";
                ctx.fillText("Счет: " + score, 10, 51);
                let rand = parseInt(Math.random() * 1000) % 3;
                scoreTracks[rand].play();
            }

        
        }


        // Отрисовка птицы и ее движение

        ctx.drawImage(bird, birdX, birdY, birdWidth, birdHeight);
        birdY += grav;


        // Счет

        ctx.fillStyle = "#000";
        ctx.fillText("Счет: " + score, 10, 51);
    }

    //Вызов функции отрисовки

    let mainInterval = setInterval(() => {
        draw()
    }, 10);
}

// Создание меню


// Создание блоков меню

let cvs = document.getElementById('canvas');
cvs.style.display = 'none';

let menu = document.getElementById('menu');

let header = document.getElementById('header');
header.style.display = 'flex';

let buttons = document.getElementById('buttons');
buttons.style.display = 'flex';




// Создание заголовка

let head = document.createElement('h1');
head.innerHTML = 'Crazy Bird';
head.style.textAlign = 'center';
head.setAttribute('id', 'head');

let score = document.createElement('h2');
score.innerHTML = `Лучшая попытка = ${highScore}`;
score.style.textAlign = 'center';
score.setAttribute('id', 'score');


//Создание кнопок выбора управления

let mouseButton = document.createElement('button');
mouseButton.innerHTML = 'Мышь';
mouseButton.setAttribute('id', 'mouse');

let keyboardButton = document.createElement('button');
keyboardButton.innerHTML = 'Клавиатура';
keyboardButton.setAttribute('id', 'keyboard');

let touchButton = document.createElement('button');
touchButton.innerHTML = 'Касания';
touchButton.setAttribute('id', 'touch');


// Возврат в библиотеку
let exit = document.createElement('a', 'exit');
exit.style.display = 'block';
exit.textContent = "Выход";
exit.href = 'https://github.com/kofes/lab2';
exit.setAttribute('id', 'exit');


// Объединение элементов заголовка

header.append(head);
header.append(score);


// Объединение кнопок управления

buttons.append(keyboardButton);
buttons.append(mouseButton);
buttons.append(touchButton);


// Объединение блоков (с заголовком и с кнопками) и кнопки "Выход"

menu.append(header);
menu.append(buttons);
menu.append(exit);


// Прогрузка меню после первого запуска

function showMenu() {

    //Появление меню

    cvs.style.display = 'none';
    menu.style.display = 'flex';
    

    //Обновление игровых данных

    fly.volume = 0;

    if (end) {
        endAudio.play();
    }
    end = false;

    score.innerHTML = `Лучшая попытка = ${highScore}`;

    mouseUse = false;
    keyboardUse = false;
    touchUse = false;

    // Выбор управления

    mouseButton.onclick = () => {
        mouseUse = true;
        gameStart();
    }

    keyboardButton.onclick = () => {
        keyboardUse = true;
        gameStart();
    }

    touchButton.onclick = () => {
        touchUse = true;
        gameStart();
    }


    // Начало игры

    function gameStart() {
        fly.volume = 0.7;
        cvs.style.display = 'block';
        menu.style.display = 'none';
        game();
    }
}

// Вызов меню

showMenu();
