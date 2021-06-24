let playWithKeyboard = false;
let playWithMouse = false;
let playWithTouch = false;

let highScore = 0;
let score = 0;

function play() {
    const canv = document.getElementById('canvas');
    const ctx = canv.getContext('2d');
    
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
    
    width = canv.width;
    height = canv.height;

    const playerHeight = 78 * width / 1000;
    const playerWidth = 78 * width / 1000;

    class Player{
        constructor(x, y, speed){
            this.x = x;
            this.y = y;
            this.speed = speed;
            this.img = new Image();
            this.img.src = 'assets/images/player.png';
            this.lives = 5;
            this.hurt = false;
            this.invincible = 0;
        }
    } 

    class Obstacle{
        constructor() {
            this.sizeX = width / 4;
            this.sizeY = height / 4;
            this.x = width;
            this.y = Math.floor(Math.random() * ((height - this.sizeY) - 0)) + 0;
            this.speed = 20;
            this.img = new Image();
            this.img.src = 'assets/images/obstacle.jpg';
        }
    }


    class Enemy{
        constructor(){
            this.speed = 5;
            this.img = new Image();
            this.img.src = 'assets/images/enemy.png';
            this.sizeX = height / 7;
            this.sizeY = height / 7;
            this.x = width;
            this.y = Math.floor(Math.random() * ((height -  this.sizeY ) - 0)) + 0;
        }
    }

    class Bullet{
        constructor(x, y, speed){
            this.x = x;
            this.y = y;
            this.speed = speed;
            this.sizeX = 50;
            this.sizeY = 21;
            this.img = new Image();
            this.img.src = 'assets/images/bullet.png';
            this.coordinates = new Array();

            while(this.x < width){
                this.coordinates.push(this.x);
                this.x += this.speed;
            }
        }
    }

    class Boss {
        constructor(x, y){
            this.speed = 1;
            this.img = new Image();
            this.img.src = 'assets/images/boss.png';
            this.sizeX = ((2 * width )/ 7);
            this.sizeY = ((2 * width )/ 7);
            this.x = width;
            this.y = Math.floor(Math.random() * ((height - this.sizeY) - 0)) + 0;
            
        }
    }

    const player = new Player(10, 200, 10);
    const boss = new Boss(width - width / 3, 0);
    const arrayOfObstacles = [];
    const arrayOfBullets = [];
    const arrayOfEnemies = [];
    let bossArrival = Math.floor(Math.random() * (300 - 50)) + 50;
    let bossWounds = 0;


    if (playWithKeyboard) {
        let pressedKeys = {};
        document.onkeydown = function(event) {
            pressedKeys[event.keyCode] = true;
            Object.keys(pressedKeys).forEach(key => {
                if (!pressedKeys[key]) {
                    return;
                } 
                if (key == 38 || key == 87) {
                    if (player.y > 0) {
                        player.y -= player.speed;
                    }
                } 
                if (key == 40 || key == 83) {
                    if (player.y + playerHeight < height) {
                        player.y += player.speed;
                    }
                } 
                if (key == 32) {
                    arrayOfBullets.push(new Bullet(player.x + playerWidth + 20, player.y + (4 * playerHeight) / 5 - 30, 30));
                }
            })
        }
        document.onkeyup = function(event) {
        pressedKeys[event.keyCode] = false;
        }
    }

    if (playWithMouse) {
        document.onclick = function () {
            arrayOfBullets.push(new Bullet(player.x + playerWidth + 20, player.y + (4 * playerHeight) / 5 - 30, 30));
        }
        document.onmousedown = function () {    
            mousedownTimeout = window.setInterval(() => {
                arrayOfBullets.push(new Bullet(player.x + playerWidth + 20, player.y + (4 * playerHeight) / 5 - 30, 30));
            }, 317);
        }
        document.onmouseup = function() {
            window.clearTimeout(mousedownTimeout);
        }
        document.onmousemove = function (event) {
            player.y = event.offsetY - (playerHeight / 2);
        }
    }

    if (playWithTouch) {
        let ongoingTouches = [];
        canv.ontouchstart = function (event) {
            event.preventDefault();
            let touches = event.changedTouches;
            ongoingTouches.push(touches[0]);
        }
        canv.ontouchmove = function (evt) {
            evt.preventDefault(); 
            let touches = evt.changedTouches;
            let moveTouch = touches[0];
            player.y = moveTouch.pageY - (playerHeight / 2);
        }
        canv.ontouchend = function (ev) {
            ev.preventDefault();
            let touches = ev.changedTouches;
            if(ev) {
                arrayOfBullets.push(new Bullet(player.x + playerWidth + 20, player.y + (4 * playerHeight) / 5 - 30, 30));
            }
            for (let i = 0; i < touches.length; i++) {
                let idx = ongoingTouchIndexById(touches[i].identifier);
                if (idx >= 0) {
                    ongoingTouches.splice(idx, 1); 
                }
            }
        }
        canv.ontouchcancel = function (et) {
            et.preventDefault();
            let touches = et.changedTouches;
            for (let i = 0; i < touches.length; i++) {
                let idx = ongoingTouchIndexById(touches[i].identifier);
                ongoingTouches.splice(idx, 1); 
            }
        }        
        function ongoingTouchIndexById(idToFind) {
            for (let i = 0; i < ongoingTouches.length; i++) {
                let id = ongoingTouches[i].identifier;
                if (id == idToFind) {
                    return i;
                }
            }
            return -1; 
        }
    }

    function statistics() {
        ctx.fillStyle = "black";
        ctx.font = "35px Verdana";
        ctx.fillText("Текущие медали: " + score, 10, 50);
        ctx.fillStyle = "red";
        ctx.fillText("Максимум медалей: " + highScore, 10, 100);
        ctx.fillStyle = "yellow";
        ctx.fillText("Высадки: x" + player.lives, 10, 150);
    }


    function gameStart() {
        ctx.clearRect(0, 0, width, height);
        statistics();
        ctx.drawImage(player.img, player.x, player.y, playerHeight, playerWidth);
        if (player.hurt) {
            player.invincible++;
        }
        if(player.invincible == 244 && player.hurt) {
            player.hurt = false;
            player.invincible = 0;
        }
        if(player.lives <= 0){
            clearInterval(mainInterval);
            gameMenu();
        }


        if (bossArrival == 0) {
            ctx.drawImage(boss.img, boss.x, boss.y, boss.sizeX, boss.sizeY);
            boss.x -= boss.speed;
            if ((boss.x + boss.sizeX > player.x) && (boss.x < (player.x + playerWidth)) && (boss.y + boss.sizeY > player.y) && (boss.y < (player.y + playerHeight))) {
                if(!player.hurt){
                    player.lives = 0;
                    player.hurt = true;
                }
            }
            arrayOfBullets.forEach(bullet => {
                if(bullet.coordinates.length != 0) {
                    if((bullet.coordinates[0] > boss.x) && (bullet.coordinates[0] < (boss.x + boss.sizeX)) && (bullet.y > boss.y) && (bullet.y < (boss.y + boss.sizeY))) {
                        arrayOfBullets.splice(arrayOfBullets.indexOf(bullet), 1);
                        ctx.clearRect(bullet.coordinates[0], bullet.y, bullet.sizeX, bullet.sizeY);
                        bossWounds++;
                        if (bossWounds > 100) {
                            score += 100;
                            if (score > highScore) {
                                highScore += 100;
                            }
                            clearInterval(mainInterval);
                            gameMenu();
                        }
                    }
                    ctx.drawImage(bullet.img, bullet.coordinates[0], bullet.y, bullet.sizeX, bullet.sizeY);
                    bullet.coordinates.splice(0, 1);
                }
                else{
                    arrayOfBullets.splice(arrayOfBullets.indexOf(bullet), 1);
                }
            });

        }



        if(arrayOfEnemies.length != 0){
            arrayOfEnemies.forEach(enemy => {
                ctx.drawImage(enemy.img, enemy.x -= enemy.speed, enemy.y, enemy.sizeX, enemy.sizeY);
                if ((enemy.x + enemy.sizeX > player.x) && (enemy.x < (player.x + playerWidth)) && (enemy.y + enemy.sizeY > player.y) && (enemy.y < (player.y + playerHeight))) {
                    if(!player.hurt){
                        player.lives--;
                        player.hurt = true;
                    }
                    arrayOfEnemies.splice(arrayOfEnemies.indexOf(enemy), 1)
                    ctx.clearRect(0, 0, width, height)
                }
            });
        }

        if(arrayOfObstacles.length != 0){
            arrayOfObstacles.forEach(obstacle => {
                ctx.drawImage(obstacle.img, obstacle.x -= obstacle.speed, obstacle.y, obstacle.sizeX, obstacle.sizeY);
                if ((obstacle.x + obstacle.sizeX > player.x) && (obstacle.x < (player.x + playerWidth)) && (obstacle.y + obstacle.sizeY > player.y) && (obstacle.y < (player.y + playerHeight))) {
                    if(!player.hurt){
                        player.lives--;
                        player.hurt = true;
                    }
                    arrayOfObstacles.splice(arrayOfObstacles.indexOf(obstacle), 1)
                    ctx.clearRect(0, 0, width, height)
                }

            });
        }

        arrayOfBullets.forEach(bullet => {
            if(bullet.coordinates.length != 0) {
                arrayOfEnemies.forEach(enemy => {
                    if((bullet.coordinates[0] > enemy.x) && (bullet.coordinates[0] < (enemy.x + enemy.sizeX)) && (bullet.y > enemy.y) && (bullet.y < (enemy.y + enemy.sizeY))) {
                        arrayOfEnemies.splice(arrayOfEnemies.indexOf(enemy), 1);
                        arrayOfBullets.splice(arrayOfBullets.indexOf(bullet), 1);
                        ctx.clearRect(bullet.coordinates[0], bullet.y,  bullet.sizeX, bullet.sizeY);
                        score ++;
                        if (bossArrival > 0) {
                            bossArrival--;
                            console.log(bossArrival);
                        }
                        if (score > highScore) {
                            highScore++;
                        }
                    }
                });
                ctx.drawImage(bullet.img, bullet.coordinates[0], bullet.y, bullet.sizeX, bullet.sizeY);
                bullet.coordinates.splice(0, 1);
            }
            else{
                arrayOfBullets.splice(arrayOfBullets.indexOf(bullet), 1);
            }
        }); 
    }


    setInterval(() => {
        if (bossArrival > 0) {
            arrayOfEnemies.push(new Enemy());
            arrayOfEnemies.forEach(enemy => {
                if(enemy.x < 0) {
                    arrayOfEnemies.splice(arrayOfEnemies.indexOf(enemy), 1);
                }
            }); 
        }
    }, 3500);


    setInterval(()=> {
        arrayOfObstacles.push(new Obstacle());
        arrayOfObstacles.forEach(obstacle => {
            if(obstacle.x < 0) {
                arrayOfObstacles.splice(arrayOfObstacles.indexOf(obstacle), 1);
            }
        }); 
    }, Math.floor(Math.random() * (10000 - 7000)) + 7000);


    let mainInterval = setInterval(() => {
        gameStart();
    }, 10);
}

const canv = document.getElementById('canvas');
canv.style.display = 'none';

const menu = document.getElementById('menu');

const header = document.getElementById('header');
header.style.display = 'flex';

const buttons = document.getElementById('buttons');
buttons.style.display = 'flex';

const head = document.createElement('h1');
head.innerHTML = "Vietnam War";
head.style.textAlign = 'center';
head.setAttribute('id', head);

let highestScore = document.createElement('h2');
highestScore.innerHTML = `Максимум медалей набрано - ${highScore}`;
highestScore.style.textAlign = 'center';
highestScore.setAttribute('id', 'highestScore');


const keyboardButton = document.createElement('button');
keyboardButton.innerHTML = 'Клавиатура';
keyboardButton.setAttribute('id', 'keyboard');

const mouseButton = document.createElement('button');
mouseButton.innerHTML = 'Мышь';
mouseButton.setAttribute('id', 'mouse');

const touchButton = document.createElement('button');
touchButton.innerHTML = 'Тачи';
touchButton.setAttribute('id', 'touch');


header.append(head);
header.append(highestScore);

buttons.append(keyboardButton);
buttons.append(mouseButton);
buttons.append(touchButton);

menu.append(header);
menu.append(buttons);


function gameMenu() {
    canv.style.display = 'none';
    menu.style.display = 'flex';

    highestScore.innerHTML = `Максимум медалей набрано - ${highScore}`;

    playWithmouse = false;
    playWithKeyboard = false;
    playWithTouch = false;
    
    keyboardButton.onclick = () => {
        playWithKeyboard = true;
        gameStart();
    }

    mouseButton.onclick = () => {
        playWithMouse = true;
        gameStart();
    }

    touchButton.onclick = () => {
        playWithTouch = true;
        gameStart();
    }


    function gameStart() {
        canv.style.display = 'block';
        menu.style.display = 'none';
        play();
    }

}

gameMenu();
