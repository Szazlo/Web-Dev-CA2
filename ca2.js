// lecture 03/11
let canvas;
let context;

let fpsInterval = 1000 / 30; // the denominator is frames-per-second
let now;
let then = Date.now(); 

let player = {
    x : 0,
    y : 0,
    width : 32,
    height : 32,
    frameX : 0,
    frameY : 0,
    xChange : 0,
    yChange : 0,
}



let enemies = [];

let floor;

let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

let IMAGES = {player: "character.png"};

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
//set floor
    floor = canvas.height - 27;
    player.x = canvas.width / 2;
    player.y = floor - player.height;
//movement
    window.addEventListener('keydown', activate, false);
    window.addEventListener('keyup', deactivate, false);
    load_images(draw);
}
 
function draw() {
    window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval);
    //canvas environment design
    context.clearRect(0,0, canvas.width, canvas.height);
    context.fillStyle = '#87cefa';
    context.fillRect(0,0, canvas.width, canvas.height);
    context.fillStyle = '#7CFC00';
    context.fillRect(0, floor-10, canvas.width, canvas.height);
    //player
    context.drawImage(IMAGES.player,
        player.frameX, player.frameY, player.width, player.height,
        player.x, player.y, player.width, player.height); // lect 03/11
    // context.drawImage(IMAGES.player,
    //     player.frameX, player.frameY, player.width, player.height,
    //     player.x, player.y, player.width, player.height); // lect 03/11
    //enemies
    if (enemies.length < 5) {
        let a = {
            x : randint(0, canvas.width),
            y : 10,
            width : 16,
            height : 16,
            xChange : 0,
            yChange : 0
        };
        enemies.push(a);
    }

    //enemies and enemy movement
    context.fillStyle = 'yellow';
    for (let a of enemies) {
        context.fillRect(a.x, a.y, a.width, a.height);
    }
    for (let a of enemies) {
        if (a.x + a.size < 0){
            a.x = canvas.width;
            a.y = randint(0, canvas.height);
         }   
         //follow player
        else{
        if (a.x < player.x){
        a.x = a.x + player.xChange+2.5;
        }
        else{
        a.x = a.x + player.xChange-2.5;
        }
        if (a.y < player.y){
            a.y = a.y + player.yChange+2.5;
        }
        else{
            a.y = a.y + player.yChange-2.5;
        }
        // a.y = a.y + player.yChange+1;
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
        stop();
        return;
    }
}

  // Update the player
  player.x = player.x + player.xChange;
  player.y = player.y + player.yChange;

// on floor
if (player.y + player.height > floor) {
    player.in_air = false;
    player.y = floor - player.height;
    player.yChange = 0;
}
if (player.y + player.height < 0) {
    player.in_air = false;
    player.y = 0 + player.height;
    player.yChange = 0;
}
if (player.x + player.width < 0) {
    player.in_air = false;
    player.x = 0 + player.width;
    player.xChange = 0;
}
if (player.x > canvas.width) {
    player.in_air = false;
    player.x = canvas.width - player.width;
    player.xChange = 0;
}

    // Going off left or right
    // if (player.x + player.width < 0) {
    //     player.x = canvas.width;
    //   } else if (player.x > canvas.width) {
    //     player.x = - player.width;
    //   }
    
    //physics
    player.yChange = player.yChange * 0.6;
    player.xChange = player.xChange * 0.6;
    
    
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
    window.removeEventListener("keydown", activate, false);
    window.removeEventListener("keyup", deactivate, false);
    window.cancelAnimationFrame(request_id);
}

//randomized spawn locations for flags
function chooseformlist(list) {
    let index = Math.floor(Math.random()*list.length);
    return list[index];
  }

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