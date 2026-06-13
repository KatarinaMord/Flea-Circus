class Mover {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(2);
    this.acceleration = createVector(0, 1);
    this.t = random(0, 1000);
    colorMode(HSB, 360, 100, 100, 100);
    this.prevPosition = this.position.copy();
    //this.life = 255;
  }

  display() {
    noFill();
    strokeWeight(4);
    line(this.prevPosition.x,this.prevPosition.y,this.position.x,this.position.y);
  }

  update() {
    this.prevPosition = this.position.copy();

    this.velocity.add(this.acceleration);
    this.velocity.limit(5);
    this.position.add(this.velocity);

    this.acceleration.mult(0);
    this.velocity.rotate(random(-0.5, 0.5));
    //this.life -= 1;
  }
  
  wheelDistance(){
    let d = dist(width / 2, height / 2, this.position.x, this.position.y);
    return d;
  }
  

  applyForce(force) {
    this.acceleration.add(force);
  }

  spawn(angleOffset = 0) {
    let child = new Mover(this.position.x, this.position.y, this.mass);
    child.velocity = this.velocity.copy();
    child.velocity.rotate(random(-0.1, 0.1) + angleOffset);
    child.velocity.mult(0.9);
    return child;
  }

  wrapEdges() {
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;

    this.prevPosition = this.position.copy();
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.setMag(4);

    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(0.15);
    return steer;
  }

  separateForce(others) {
    let perceptionRadius = 28;
    let steering = createVector(0, 0);
    let total = 0;

    for (let other of others) {
      let d = p5.Vector.dist(this.position, other.position);

      if (other !== this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.setMag(4);
      steering.sub(this.velocity);
      steering.limit(0.22);
    }

    return steering;
  }

  alignForce(others) {
    let perceptionRadius = 55;
    let steering = createVector(0, 0);
    let total = 0;

    for (let other of others) {
      let d = p5.Vector.dist(this.position, other.position);

      if (other !== this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.setMag(4);
      steering.sub(this.velocity);
      steering.limit(0.08);
    }

    return steering;
  }

  cohesionForce(others) {
    let perceptionRadius = 55;
    let center = createVector(0, 0);
    let total = 0;

    for (let other of others) {
      let d = p5.Vector.dist(this.position, other.position);

      if (other !== this && d < perceptionRadius) {
        center.add(other.position);
        total++;
      }
    }

    if (total > 0) {
      center.div(total);
      return this.seek(center);
    }

    return createVector(0, 0);
  }

  flock(others) {
    let separation = this.separateForce(others);
    let alignment = this.alignForce(others);
    let cohesion = this.cohesionForce(others);

    separation.mult(1.7);
    alignment.mult(1.0);
    cohesion.mult(0.9);

    this.applyForce(separation);
    this.applyForce(alignment);
    this.applyForce(cohesion);
  }
}
