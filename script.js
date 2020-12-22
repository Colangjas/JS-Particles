const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// get mouse position
let mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 80) * (canvas.width / 80),
};

window.addEventListener("mousemove", function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
});


// create particles
class Particle {
  constructor(x, y, directionX, directionY, radius, colour) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.radius = radius;
    this.colour = colour;
  }
  // method to draw individual particles
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  // check particle position - check mouse position - move the particle - then draw the particle
  update() {
    // check if particle is still within canvas
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // check collision detection - mouse position  / particles position
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius + this.radius) {
      if (mouse.x < this.x && this.x < canvas.width - this.radius * 10) {
        this.x += 10;
      }
      if (mouse.x > this.x && this.x > this.radius * 10) {
        this.x -= 10;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.radius * 10) {
        this.y += 10;
      }
      if (mouse.y > this.y && this.y > this.radius * 10) {
        this.y -= 10;
      }

      // move particle
      this.x += this.directionX;
      this.y += this.directionY;
      // draw particle
      this.draw();
    }
  }
}

// create particle array
function init() {
  particlesArray = [];
  let numParticles = (canvas.height * canvas.width) / 9000;
  for (let i = 0; i < numParticles; i++) {
    let radius = Math.random() * 5 + 1;
    let x =
      Math.random() * (innerHeight - radius * 2 - radius * 2) + radius * 2;
    let y =
      Math.random() * (innerHeight - radius * 2 - radius * 2) + radius * 2;
    let directionX = Math.random() * 5 - 2.5;
    let directionY = Math.random() * 5 - 2.5;
    let colour = "#444444";

    particlesArray.push(
      new Particle(x, y, directionX, directionY, radius, colour)
    );
  }
  console.log(particlesArray);
}

// animate loop
function animate() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  window.requestAnimationFrame(animate);
  connect();
}

// check if particles are close enough to draw a line
function connect() {
    let opacity = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = 0; b < particlesArray.length; b++) {
      let distance =
        (particlesArray[a].x - particlesArray[b].x) *
          (particlesArray[a].x - particlesArray[b].x) +
        (particlesArray[a].y - particlesArray[b].y) *
          (particlesArray[a].y - particlesArray[b].y);
      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacity = opacity - distance/200000;
        ctx.strokeStyle = "rgba(120,120,120," + opacity +")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

window.addEventListener('resize', function(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = (canvas.height/80) * (canvas.height/80);
    init();
});

window.addEventListener('mouseout', function(){
    mouse.x = null;
    mouse.y = null;
});

init();
animate();
