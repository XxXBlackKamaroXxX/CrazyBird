let totalEatenApples = 0;
let bestWinStreak = 0;
localStorage.setItem('eatenApples', totalEatenApples);
localStorage.setItem('winStreak', bestWinStreak);

function game() {

    //Создание канваса

    const cvs = document.getElementById("canvas");
    const ctx = cvs.getContext("2d");

    width = cvs.width = 800;
    height = cvs.height = 800;


    //Игровые объекты и переменные

    let audio = new Audio();
    audio.src = "assets/BackAudio.mp3";
    audio.volume = 0.1;

    let grid = 40;
    let count = 0;

    let snake = {

        x : 80,
        y : 80,

        dx : grid,
        dy : 0,

        cells : [],

        maxCells : 4
    };

    let apple = {

        x: 40,
        y: 160
    };

    let applesToWin = Math.floor(Math.random() * (77 - 43)) + 43;
    let wins = 0;


    // Управление и выход

    document.onkeydown = function(event) {
        if (event.keyCode == 27) {
            if (localStorage.getItem('eatenApples', totalEatenApples) < totalEatenApples) {
                localStorage.removeItem('eatenApples');
                localStorage.setItem('eatenApples', totalEatenApples);
            }
            if (localStorage.getItem('winStreak', bestWinStreak) < bestWinStreak) {
                localStorage.removeItem('winStreak');
                localStorage.setItem('winStreak', bestWinStreak);
            }
            audio.pause();
            clearInterval(mainInterval);
            showMenu();
        }
        if ((event.keyCode == 65 || event.keyCode == 37) && snake.dx == 0) {
            snake.dx = -grid;
            snake.dy = 0;
        }
        else if ((event.keyCode == 68 || event.keyCode == 39) && snake.dx == 0) {
            snake.dx = grid;
            snake.dy = 0;
        }
        else if ((event.keyCode == 87 || event.keyCode == 38) && snake.dy == 0) {
            snake.dx = 0;
            snake.dy = -grid;
        }
        else if ((event.keyCode == 83 || event.keyCode == 40) && snake.dy == 0) {
            snake.dx = 0;
            snake.dy = grid;
        }
    }


    // Вспомогательная функция

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


    // Отрисовка

    function draw() {    
        if (++count < 6) {  
            return;
        }
        count = 0;
        ctx.clearRect(0, 0, width, height);
        if (audio.paused) {
            audio.play();

        }
        if (applesToWin == 0) {
            wins++;
            if (bestWinStreak < wins) {
                bestWinStreak = wins;
            }
            snake.x = 80;
            snake.y = 80;

            snake.dx = grid;
            snake.dy = 0;

            snake.cells = [];

            snake.maxCells = 4;

            applesToWin = Math.floor(Math.random() * (77 - 43)) + 43;

            apple.x = getRandomInt(1, (width / grid)) * grid - grid;
            apple.y = getRandomInt(1, (height / grid)) * grid - grid;
        }

        snake.x += snake.dx;
        snake.y += snake.dy;

        if (snake.x >= width) {
            snake.x = 0;
        }
        else if (snake.x < 0){
            snake.x = width - grid;
        }

        if (snake.y >= height) {
            snake.y = 0;
        }
        else if (snake.y < 0){
            snake.y = height - grid;
        }

        snake.cells.unshift({
            x: snake.x,
            y: snake.y
        });

        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

        ctx.fillStyle = 'black';
        snake.cells.forEach(function (cell, index) {
            ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
            if (cell.x == apple.x && cell.y == apple.y) {
                snake.maxCells++;
                applesToWin--;
                totalEatenApples++;
                apple.x = getRandomInt(1, (width / grid)) * grid - grid;
                apple.y = getRandomInt(1, (height / grid)) * grid - grid;
            }

            for (let i = index + 1; i < snake.cells.length; i++) {
                if ((snake.cells[i].x == cell.x && snake.cells[i].y == cell.y) || (snake.cells[snake.cells.length - 1].x == cell.x && snake.cells[snake.cells.length - 1].y == cell.y)) {
                    wins = 0;
                    applesToWin = Math.floor(Math.random() * (77 - 43)) + 43;
                    snake.x = 80;
                    snake.y = 80;

                    snake.dx = grid;
                    snake.dy = 0;

                    snake.cells = [];

                    snake.maxCells = 4;

                    apple.x = getRandomInt(1, (width / grid)) * grid - grid;
                    apple.y = getRandomInt(1, (height / grid)) * grid - grid;
                }
            }

        });

        ctx.font = "35px Verdana";
        ctx.fillStyle = "green";
        ctx.fillText("Осталось яблок:" + applesToWin, 20, 40);
        ctx.fillStyle = "blue";
        ctx.fillText("Побед подряд:" + wins, 500, 40);
        ctx.fillStyle = "yellow";
        ctx.fillText("Esc = выход в меню", 200, 790);

    }

    // Вызов функции рисования

    let mainInterval = setInterval(() => {
        draw();
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
head.innerHTML = 'Crawling Snake';
head.style.textAlign = 'center';
head.setAttribute('id', 'head');

let eatenApples = document.createElement('h2');
eatenApples.innerHTML = `Всего съедено яблок = ${totalEatenApples}`;
eatenApples.style.textAlign = 'center';
eatenApples.setAttribute('id', 'eatenApples');

let totalWins = document.createElement('h2');
totalWins.innerHTML = `Максимум побед подряд = ${bestWinStreak}`;
totalWins.setAttribute('id', 'totalWins');


//Создание кнопок начала игры/выхода

let playButton = document.createElement('button');
playButton.innerHTML = 'Играть';
playButton.setAttribute('id', 'play');

let exit = document.createElement('a', 'exit');
exit.textContent = "Выход";
exit.href = 'https://github.com/kofes/lab2';
exit.setAttribute('id', 'exit');


// Объединение элементов заголовка

header.append(head);
header.append(eatenApples);
header.append(totalWins);


// Объединение кнопок 

buttons.append(playButton);
buttons.append(exit);


// Объединение блоков (с заголовком и с кнопками)

menu.append(header);
menu.append(buttons);


// Прогрузка меню после первого запуска

function showMenu() {

    //Появление меню

    cvs.style.display = 'none';
    menu.style.display = 'flex';
    

    //Обновление игровых данных

    eatenApples.innerHTML = `Всего съедено яблок = ${totalEatenApples}`;
    totalWins.innerHTML = `Максимум побед подряд = ${bestWinStreak}`;

    // Начало игры

    playButton.onclick = () => {
        gameStart();
    }

    function gameStart() {
        cvs.style.display = 'block';
        menu.style.display = 'none';
        game();
    }
}

// Вызов меню

showMenu();
