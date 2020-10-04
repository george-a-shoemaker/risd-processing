class JuggleBall extends Jugglable {
    constructor(x, y, toss) {
        super(toss)
        this.x = x
        this.y = y
        this.caught = false
        this.xDelta = 0.5;
    }

    draw() {
        ellipse(this.x, this.y - this.toss.func(this.position), 20, 20)
        if (this.caught) this.x -= this.xDelta;
        else {
            this.stepToss()
            this.x += this.xDelta
        }
    }
}

const h = 10;
const duration = 50;
const tosses = JuggleToss.getTosses(h, duration)
let ball1 = new JuggleBall(20, 430, tosses[5])
let ball2 = new JuggleBall(45, 430, tosses[3])
ball2.position = ball2.toss.duration/2
let ball3 = new JuggleBall(70, 430, tosses[1])
// ball3.position = ball3.toss.duration*2/3
let balls = [ball1, ball2, ball3]

let pattern = [3,1,5]
var patternIndex = 0;
const nextToss = () => {
    let maxIndex = pattern.length-1
    patternIndex += 1
    if (patternIndex > maxIndex) patternIndex = 0
    return tosses[pattern[patternIndex]]
}

ball1.onComplete = () => {
    ball1.toss = nextToss()
}
ball2.onComplete = () => {
    ball2.toss = nextToss()
}
ball3.onComplete = () => {
    ball3.toss = nextToss()
}



function setup() {
    stroke(0);
    const canvas = createCanvas(800, 450);
    canvas.parent('sketch-holder');
    canvas.style("display", "block");
}

function draw() {
    background(220)
    balls.forEach(ball => ball.draw())
    line(0, 440, 800, 440)
}