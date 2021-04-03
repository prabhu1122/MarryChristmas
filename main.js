class SnowFlake {
    constructor(x, y, img) {
        this.x = x;
        this.y = y;
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        this.r = getRandomSize();
        this.img = img;
        this.xOff;
        this.angle = random(TWO_PI);
        this.dir = (random(1) > 0.5) ? 1 : -1;

        this.applyForce = function(force) {
            //parallex
            let f = force.copy();
            f.mult(this.r);
            this.acc.add(f);
        }

        this.update = function() {
            // body...
            this.xOff = sin(this.angle) * this.r;
            this.vel.add(this.acc);
            this.vel.limit(this.r * 0.1);
            if (this.vel.mag() < 1) {
                this.vel.normalize();
            }
            this.pos.add(this.vel);
            this.acc.mult(0);
            if (this.pos.y > height + this.r) {
                this.pos.y = -this.r;
            }
            if (this.pos.x > width + this.r) {
                this.pos.x = -this.r;
            }
            if (this.pos.x < -this.r) {
                this.pos.x = width + this.r;
            }
        }

        this.render = function(arg) {
            push();
            translate(this.pos.x + this.xOff, this.pos.y);
            rotate(this.angle);
            this.angle += this.dir * this.vel.mag() / 200;
            imageMode(CENTER);
            image(this.img, 0, 0, this.r, this.r * 1.1);
            pop();
        }
    }
}

class Star {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.stars = function() {
            strokeWeight(1);
            var intens = map(this.y, 0, height, 200, 0);
            stroke(intens);
            point(this.x, this.y);
        }
    }
}

function getRandomSize() {
    let r = pow(random(0, 1), 3);
    return constrain(r * 32, 2, 36);
    //return the random value more near to 0 from (0 to 1);
    /*let r = randomGaussian() * 3;
    return constrain(abs(r * r), 1, 32);
    */
    /* while (true) {
    let r1 = random(1);
    let r2 = random(1);
    if (r2 > r1) {
       return r1 * 30;
    }
     }*/
}

var star = [];
var snow = [];
var snowflakes;
var gravity;
var col = ['#2216ef', '#16ef22', '#ef2216', '#ef16e3', '#e3ef16', '#8f16ef'];
var bomb;
var zOff = 0;

function preload() {
    snow1 = loadImage("libs/whiteSnow.png");
    snow2 = loadImage("libs/Snow1.png");
    var texture = [snow1, snow2];
    //Jingle = loadSound("libs/Jingle Bells.mp3");
}

function setup() {
    createCanvas(displayWidth, displayHeight - 82);
    background(0);
    // Jingle.play();
    gravity = createVector(0, 0.2);
    for (var i = 0; i < 200; i++) {
        star.push(new Star(random(width), random(height)));
    }
    for (var i = 0; i < 300; i++) {
        let x = random(width);
        let y = random(height);
        snow.push(new SnowFlake(x, y, snow1));
    }
}

function draw() {
    //stats
    background(0);
    for (var i in star) {
        star[i].stars();
    }

    zOff += .01;
    for (var eachFlakes of snow) {
        let xOff = eachFlakes.pos.x / width;
        let yOff = eachFlakes.pos.y / height;
        let wAngle = noise(xOff, yOff, zOff) * TWO_PI;
        let wind = p5.Vector.fromAngle(wAngle);
        wind.mult(.1);

        eachFlakes.applyForce(wind);
        eachFlakes.applyForce(gravity);
        eachFlakes.render();
        eachFlakes.update();
    }
}