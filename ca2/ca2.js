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
    height : 48,
    frameX : 0,
    frameY : 0,
    xChange : 0,
    yChange : 0,
    in_air : false
}

let floor;

let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;


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
    draw();
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
    context.fillStyle = 'red';
    context.fillRect(player.x, player.y, player.width, player.height);
    // context.drawImage(IMAGES.player,
    //     player.frameX, player.frameY, player.width, player.height,
    //     player.x, player.y, player.width, player.height); // lect 03/11
 
    //movement keys
    if (moveLeft) {
    player.xChange = player.xChange - 4;
    // player.frameX = 69;
    // context.drawImage(IMAGES.player,
    //     player.frameX, player.frameY, player.width, player.height,
    //     player.x, player.y, player.width, player.height);
  }
    if (moveRight) {
    player.xChange = player.xChange + 4;
    // player.frameX = 5;
    // context.drawImage(IMAGES.player,
    //     player.frameX, player.frameY, player.width, player.height,
    //     player.x, player.y, player.width, player.height);
  }
    if (moveUp && ! player.in_air) {
        player.yChange = player.yChange - 4;
        // player.in_air = true;
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
    // Going off left or right
    if (player.x + player.width < 0) {
        player.x = canvas.width;
      } else if (player.x > canvas.width) {
        player.x = - player.width;
      }
    
    //physics
    player.yChange = player.yChange + 2; // gravity
    player.xChange = player.xChange * 0.6 // friction
    
    if (player.in_air === false) {
    player.yChange = player.yChange * 0.5; // friction
    }

    }        
//randint function
function randint(min, max) {
    return Math.round (Math.random() * (max - min)) + min;
}

//key down
function activate(event) {
    let key= event.key;
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

function stop() {
    window.removeEventListener("keydown", activate, false);
    window.removeEventListener("keyup", deactivate, false);
    window.cancelAnimationFrame(request_id);
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