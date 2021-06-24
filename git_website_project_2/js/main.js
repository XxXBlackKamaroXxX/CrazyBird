let totalDeathCount = 0;
let totalVictoriesCount = 0;
let size = 0;
function game() {
    function draw() {


        // Создаем канвас

        const cvs = document.getElementById("canvas");
        const ctx = cvs.getContext("2d");


        // Игровые объекты и переменные

        width = cvs.width = size * 36;
        height = cvs.height = size * 36;

        const cellNumber = size;
        const cellSize = 36;
        const cellDrawSize = 34;
        const numberOfCells = cellNumber ** 2;

        let openedCells = 0;
        let numberOfMines = 0;
        let numberOfExploredMines = 0;
        let alive = true;
        let mass = [];
        let openedMass = [];
        let checkedMass = [];


        // Определяем число мин и их расположение

        for (let i = 0; i < cellNumber; i++) {
            openedMass[i] = [];
            checkedMass[i] = [];
            mass[i] = [];
            for (let j = 0; j < cellNumber; j++) {
                openedMass[i][j] = false;
                checkedMass[i][j] = false;
                value = Math.floor(Math.random() * (cellNumber - 0)) + 0;
                if ((value == (cellNumber - 1) || value == 1) && numberOfMines < size) {
                    mass[i][j] = -1;
                    numberOfMines++;
                }
                else {
                    mass[i][j] = 0;
                }
            }
        }


        // Считаем количество мин вокруг незаминированных полей
            
        for (let i = 0; i < cellNumber; i++) {
            for (let j = 0; j < cellNumber; j++) {
                if (mass[i][j] == -1) {
                    for (let k = (i - 1); k <= (i + 1); k++) {
                        for (let p = (j - 1); p <= (j + 1); p++) {
                            if (k >= 0 && k < cellNumber) {
                                if (p >= 0 && p < cellNumber) {
                                    if (mass[k][p] != -1) {
                                        mass[k][p]++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }



        // Красим неоткрытые клетки поля

        for (let i = 0; i < cellNumber; i++) {
            for (let j = 0; j < cellNumber; j++) {
                ctx.fillStyle = "rgba(255, 255, 0, 0.6)";
                ctx.fillRect(i * cellSize, j * cellSize, cellDrawSize, cellDrawSize);
            }
        }


        // Действия при нажатии левой кнопкой мыши

        document.onclick = function(e) {
            x = e.offsetX;
            y = e.offsetY;
            if ((x >= 0 && x <= width) && (y >= 0 && y <= width) && alive) {
                cell_x = Math.trunc(x / cellSize);
                cell_y = Math.trunc(y / cellSize);
                if (mass[cell_x][cell_y] != -1) {
                    if (mass[cell_x][cell_y] > 0 && openedMass[cell_x][cell_y] == false) {
                        if (checkedMass[cell_x][cell_y] == false) {
                            ctx.fillStyle = "black";
                            ctx.font = "25px Verdana";
                            ctx.fillText(mass[cell_x][cell_y], cellSize * cell_x + 9, cellSize * cell_y + 25);
                            openedCells++;
                            openedMass[cell_x][cell_y] = true;
                            if (openedCells + numberOfExploredMines >= numberOfCells || numberOfExploredMines == numberOfMines) {
                                totalVictoriesCount++;
                                showMenu();
                            }
                        }
                    }
                    else {
                        for (let i = (cell_x - 1); i <= (cell_x + 1); i++) {
                            for (let j = (cell_y - 1); j <= (cell_y + 1); j++) {
                                if (i >= 0 && i < cellNumber) {
                                    if (j >= 0 && j < cellNumber) {
                                        if (mass[i][j] == 0 && openedMass[i][j] == false) {
                                            openedMass[i][j] = true;
                                            ctx.fillStyle = 'orange';
                                            ctx.fillRect(i * cellSize, j * cellSize, cellDrawSize, cellDrawSize);
                                            openedCells++;
                                            if (openedCells + numberOfExploredMines >= numberOfCells || numberOfExploredMines == numberOfMines) {
                                                totalVictoriesCount++;
                                                showMenu();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    if (checkedMass[cell_x][cell_y] == false) {
                        alive = false;                    
                        ctx.fillStyle = 'red';
                        ctx.fillRect(cell_x * cellSize, cell_y * cellSize, cellDrawSize, cellDrawSize);
                        totalDeathCount++;
                        showMenu();
                    }
                }
            }
        }


        // Действия при нажатии правой кнопкой мыши

        document.oncontextmenu = function(event) {
            event.preventDefault();
            x = event.offsetX;
            y = event.offsetY;
            if ((x >= 0 && x <= width) && (y >= 0 && y <= width) && alive) {
                cell_x = Math.trunc(x / cellSize);
                cell_y = Math.trunc(y / cellSize);
                if (mass[cell_x][cell_y] == -1) {
                    if (openedMass[cell_x][cell_y] == false) {
                        ctx.fillStyle = 'green';
                        ctx.fillRect(cell_x * cellSize, cell_y * cellSize, cellDrawSize, cellDrawSize);
                        numberOfExploredMines++;
                        openedMass[cell_x][cell_y] = true;
                        checkedMass[cell_x][cell_y] = true;
                        if (openedCells + numberOfExploredMines >= numberOfCells || numberOfExploredMines == numberOfMines) {
                            totalVictoriesCount++;
                            showMenu();
                        }
                    }
                    else {
                        ctx.fillStyle = "rgba(255, 255, 0, 0.6)";
                        ctx.fillRect(cell_x * cellSize, cell_y * cellSize, cellDrawSize, cellDrawSize);
                        numberOfExploredMines--;
                        openedMass[cell_x][cell_y] = false;
                        checkedMass[cell_x][cell_y] = false;
                    }
                }
                else {
                    if (openedMass[cell_x][cell_y] == false) {
                        ctx.fillStyle = 'green';
                        ctx.fillRect(cell_x * cellSize, cell_y * cellSize, cellDrawSize, cellDrawSize);
                        openedMass[cell_x][cell_y] = true;
                        checkedMass[cell_x][cell_y] = true;
                    }
                    else {
                        if (mass[cell_x][cell_y] > 0) {
                            ctx.fillStyle = "rgba(255, 255, 0, 0.6)";
                            ctx.fillRect(cell_x * cellSize, cell_y * cellSize, cellDrawSize, cellDrawSize);
                            openedMass[cell_x][cell_y] = false;
                            checkedMass[cell_x][cell_y] = false;
                        }
                        else if (mass[cell_x][cell_y] == 0 && checkedMass[cell_x][cell_y] == true) {
                            ctx.fillStyle = "rgba(255, 255, 0, 0.6)";
                            ctx.fillRect(cell_x * cellSize, cell_y * cellSize, cellDrawSize, cellDrawSize);
                            openedMass[cell_x][cell_y] = false;
                            checkedMass[cell_x][cell_y] = false;
                        }
                    }
                }
            }
        }

    }


    // Вызов функции отрисовки

    draw();
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

let sizeInput = document.getElementById('sizeInput');
sizeInput.style.display = 'none';


// Создание заголовка

let head = document.createElement('h1');
head.innerHTML = 'Explosive madness';
head.style.textAlign = 'center';
head.setAttribute('id', 'head');

let explosiveDeaths = document.createElement('h2');
explosiveDeaths.innerHTML = `Общее число смертей - ${totalDeathCount}`;
explosiveDeaths.style.textAlign = 'center';
explosiveDeaths.setAttribute('id', 'explosiveDeaths');

let deactivatedFields = document.createElement('h2');
deactivatedFields.innerHTML = `Общее число побед - ${totalVictoriesCount}`;
deactivatedFields.setAttribute('id', 'deactivatedFields');

let info = document.createElement('h3');
info.style.display = 'none';
info.innerHTML = "Введите размер поля (10 - 25), затем нажмите Enter";
info.setAttribute('id', 'info');


//Создание кнопок 

let playButton = document.createElement('button');
playButton.innerHTML = 'Играть';
playButton.setAttribute('id', 'playButton');

let bombSender = document.getElementById('bombSender');


// Объединение элементов заголовка

header.append(head);
header.append(explosiveDeaths);
header.append(deactivatedFields);
header.append(info);


// Объединение кнопок 

buttons.append(playButton);
buttons.append(sizeInput);

// Объединение блоков (с заголовком и с кнопками)

menu.append(header);
menu.append(buttons);
menu.append(bombSender);


// Прогрузка меню после первого запуска

function showMenu() {

    //Появление меню

    cvs.style.display = 'none';
    menu.style.display = 'flex';
    playButton.style.display = 'block';
    info.style.display = 'none';
    sizeInput.value = '';
    sizeInput.style.display = 'none';
    

    //Обновление игровых данных

    explosiveDeaths.innerHTML = `Общее число смертей = ${totalDeathCount}`;
    deactivatedFields.innerHTML = `Общее число побед = ${totalVictoriesCount}`;
    document.getElementById("countOfWins").value = totalVictoriesCount;

    // Начало игры

    playButton.onclick = () => {
        playButton.style.display = 'none';
        sizeInput.style.display = 'flex';
        info.style.display = 'flex';
    }
    
    sizeInput.oninput = function myFunction() {
        size = sizeInput.value;
    }

    document.onkeydown = function(ev) {
        if (ev.keyCode == 13) {
            if(size >= 10 && size <= 25) {
                gameStart();
            }
        }
    }
    
    function gameStart() {
        cvs.style.display = 'block';
        menu.style.display = 'none';
        game();
    }
}

// Вызов меню

showMenu();


