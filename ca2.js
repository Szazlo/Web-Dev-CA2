// lecture 03/11
let canvas;
let context;
//render speed
let fpsInterval = 1000 / 30; // the denominator is frames-per-second
let now;
let then = Date.now();
let request_id; 

//player setup
let player = {
    x : 0,
    y : 0,
    width : 20,
    height : 27,
    frameX : 5,
    frameY : 5,
    xChange : 0,
    yChange : 0,
}
let god = false;
//enemy array
let enemies = [];

//movement keys
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
//enemy settings
let enemySpeed = 2;
let speedmultiplier = 1;
//possible objective spawn coords
let objX = [110,85,320,480,765,880];
let objY = [65,350,120,350,370,100];
let objLen = objX.length;
let objSpawn = randint(0, objLen);
//score tracking
let objVal = 20;
let playerCredits = 0;
let year = 1;

//assets
let IMAGES = {player: "character.png", map: "map.JPG", enemy: "enemy.png", obj: "book.png"};

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
//set floor
    player.x = canvas.width / 2;
    player.y = canvas.height - player.height;
//movement
    window.addEventListener('keydown', activate, false);
    window.addEventListener('keyup', deactivate, false);
    load_images(draw);
}
 
function draw() {
    request_id = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval);
    //canvas environment design
    context.clearRect(0,0, canvas.width, canvas.height);
    context.drawImage(IMAGES.map,0,0); 
    //player
    context.drawImage(IMAGES.player,
        player.frameX, player.frameY, player.width, player.height,
        player.x, player.y, player.width, player.height); // lect 03/11
    //enemies
    if (enemies.length < 5) {
        let a = {
            x : randint(0, canvas.width),
            y : 10,
            width : 28,
            height : 35,
            xChange : 0,
            yChange : 0
        };
        enemies.push(a);
    }
    if (enemySpeed > 6){
        enemySpeed = 6;
    }
    //innit obj spawning
    context.drawImage(IMAGES.obj,
        1, 1, 42, 35,
        objX[objSpawn], objY[objSpawn], 42, 35);
    //credit counter
    context.fillStyle = 'gold';
    context.font = "40px Arial";
    context.fillText(playerCredits,10,40);
    context.fillText("Year: "+year,canvas.width-150,40);
    // objective counter
    if (playerCredits >= 60) {
        year += 1;
        playerCredits = 0;
        objVal -= 5;
        speedmultiplier += 0.05;
        enemies = [];
        if (year == 5) {
            alert("You win! You have completed university!");
            stop();
        }
    }

    //enemies and enemy movement
    context.fillStyle = 'yellow';
    for (let a of enemies) {
        context.drawImage(IMAGES.enemy,
            3, 3, a.width, a.height,
            a.x, a.y, a.width, a.height);
    }
    for (let a of enemies) {
        if (a.x + a.size < 0){
            a.x = canvas.width;
            a.y = randint(0, canvas.height);
         }   
         //follow player
        else{
        if (a.x < player.x){
        a.x = a.x + player.xChange+enemySpeed;
        }
        else{
        a.x = a.x + player.xChange-enemySpeed;
        }
        if (a.y < player.y){
            a.y = a.y + player.yChange+enemySpeed;
        }
        else{
            a.y = a.y + player.yChange-enemySpeed;
        }
        }

    //movement keys
    if (moveLeft) {
    player.xChange = player.xChange - 1;
    player.frameX = 69;
    context.drawImage(IMAGES.player,
        player.frameX, player.frameY, player.width, player.height,
        player.x, player.y, player.width, player.height);
  }
  if (moveDown) {
    player.yChange = player.yChange + 1;}

    if (moveRight) {
    player.xChange = player.xChange + 1;
    player.frameX = 4;
    context.drawImage(IMAGES.player,
        player.frameX, player.frameY, player.width, player.height,
        player.x, player.y, player.width, player.height);
  }
    if (moveUp) {
        player.yChange = player.yChange - 1;
  }

//collisions
for (let a of enemies){
    if (player_collides(a)){
        player.frameX = 64; player.frameY = 111;
        context.drawImage(IMAGES.player,
            player.frameX, player.frameY, player.width, player.height,
            player.x, player.y, player.width, player.height);
        stop();
        return;
    }
}

if (obj_reached()){
    objSpawn = randint(0, objLen);
    playerCredits = playerCredits + objVal;
    enemySpeed = enemySpeed*speedmultiplier;
}

  // Update the player
  player.x = player.x + player.xChange;
  player.y = player.y + player.yChange;

// on floor
if (player.y + player.height > canvas.height) {
    player.in_air = false;
    player.y = canvas.height - player.height;
    player.yChange = 0;
}
if (player.y < 0) {
    player.in_air = false;
    player.y = 0;
    player.yChange = 0;
}
if (player.x < 0) {
    player.in_air = false;
    player.x = 0;
    player.xChange = 0;
}
if (player.x + player.width > canvas.width) {
    player.in_air = false;
    player.x = canvas.width - player.width;
    player.xChange = 0;
}

    //physics
    player.yChange = player.yChange * 0.6;
    player.xChange = player.xChange * 0.6;
    console.log(enemySpeed)
    
    }
    }        
//randint function
function randint(min, max) {
    return Math.round (Math.random() * (max - min)) + min;
}

//key down
function activate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = true;
     } else if (key === "ArrowUp") {
        moveUp = true;
    } else if (key === "ArrowRight") {
        moveRight = true;
     } else if (key === "ArrowDown") {
        moveDown = true;
    } else if (key === "g" || key === "G") {
        if (god){god=false;} else{god=true;}
    }
}

//key up
function deactivate(event) {
    let key= event.key;
    if (key === "ArrowLeft") {
        moveLeft = false;
     } else if (key === "ArrowUp") {
        moveUp = false;
    } else if (key === "ArrowRight") {
        moveRight = false;
     } else if (key === "ArrowDown") {
        moveDown = false;
}
}

function obj_reached() {
    if (player.x + player.width < objX[objSpawn] ||
        objX[objSpawn] + 42 < player.x ||
        player.y > objY[objSpawn] + 35 ||
        objY[objSpawn] > player.y + player.height) {
        return false;
     } else {
        return true;
    }
}

function player_collides (a) {
    if (player.x + player.width/2 < a.x ||
        a.x + a.width < player.x ||
        player.y > a.y + a.height ||
        a.y > player.y + player.height/2) {
        return false;
     } else {
        return true;
    }
}

function stop() {
    if (god){
        enemies = [];
        player.frameX = 5;
        player.frameY = 5;
        draw();
    }
    else{
    window.removeEventListener("keydown", activate, false);
    window.removeEventListener("keyup", deactivate, false);
    window.cancelAnimationFrame(request_id);}
}

//randomized spawn locations for flags
// function choose_from_list(list) {
//     let index = Math.floor(Math.random()*list.length);
//     return list[index];
//   }
//replace with randint method

function load_images(callback) {
    let num_images = Object.keys(IMAGES).length;
    let loaded = function() {
        num_images = num_images - 1;
        if (num_images === 0) { 
            callback();
        }
    };
   for (let name of Object.keys(IMAGES)) {
        let img = new Image();
        img.addEventListener("load", loaded, false);
        img.src = IMAGES[name];
        IMAGES[name] = img;
   }}