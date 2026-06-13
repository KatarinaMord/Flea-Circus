let movers = [];
let wheel;
let ground;
let wormhole;
let song;
let squeak;
let volumeSlider;
let angle = 0;
let rotation = 0;
let resetButton;
let font;

function preload() {
  wheel = loadImage("/assets/wheel.png");
  ground = loadImage("/assets/background.png")
  wormhole = loadImage("/assets/wormhole.png")
  song = loadSound("/assets/song.mp3");
  squeak = loadSound("/assets/squeak.mp3");
  font = loadFont("/assets/cocogoose.ttf");
}

function setup() {
  song.loop();
  createCanvas(windowWidth, windowHeight);
  noFill();
  for (let i = 0; i < 10; i++) {
    let m = new Mover(random(width), random(height));
    movers.push(m);
  }

  imageMode(CENTER);
  angleMode(DEGREES);

  volumeSlider = createSlider(0, 1, 0.5, 0.01);
  volumeSlider.position(145, 10);
  volumeSlider.size(80);

  resetButton = createButton('Flea Count Reset');
  resetButton.style("border-radius","12px");
  resetButton.style("font-size", "15px");
  resetButton.style("border-color", "#A03434");
  resetButton.style("background-color","#A03434");
  resetButton.style("color", "white");
  resetButton.position(10, 40);
  resetButton.mousePressed(resetMovers);
}

function draw() {
  image(ground, width/2, height/2);
  fill(255, 0, 100, 8);
  noStroke();
  rect(0,0,width,height);
  song.setVolume(volumeSlider.value());

  fill("#A03434");
  stroke("#A03434");
  textFont(font);
  textSize(16);
  strokeWeight(0.5);
  text("Song volume:", 12, 26);

  push();
  translate(width / 2, height / 2);
  rotate(angle);
  image(wheel, 0, 0, height / 2, height / 2);
  pop();

  push();
  translate(width/4, height/4);
  rotate(rotation);
  image(wormhole, 0,0, height/8, height/8);
  pop();


  push();
  translate(width*0.73, height*0.75,);
  rotate(rotation);
  image(wormhole, 0, 0, height/8, height/8);
  pop();

  spinSpeed = 1;
  stroke(0);
  for (let mover of movers) {
    //mover.flock(movers);   
    mover.update();
    
    if(mover.wheelDistance() < (height*0.2) ){
      spinSpeed = 5;
      mover.velocity.mult(5);
    }

    let d1 = dist(width/4, height/4, mover.position.x, mover.position.y);
    let d2 = dist(width*0.73, height*0.75, mover.position.x, mover.position.y);

    if(d1 < height/16){
      mover.position.x = width*0.78;
      mover.position.y = height*0.8;
      squeak.play();
    }

    if(d2 < height/16){
      mover.position.x = width/4.5;
      mover.position.y = height/4.5;
      squeak.play();
    }
    
    mover.wrapEdges();
    mover.display();
  }
  
  rotation = rotation - 2;
  angle = angle + spinSpeed;
}

function mousePressed() {
  let mover = new Mover(mouseX, mouseY, 20);
  movers.push(mover);
}

function resetMovers() {
  movers = [];  
}