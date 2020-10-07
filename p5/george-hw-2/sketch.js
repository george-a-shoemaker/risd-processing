class JuggleBall extends Jugglable {
    constructor(x, y, toss) {
        super(toss)
        this.x = x
        this.y = y
    }

    static getBalls(x, xSpacer, y, n, h, duration) {
        let balls = []
        let initialTosses = JuggleToss.getTosses(h, duration)
        for (let i=0; i<n; i++) {
            let ball = new JuggleBall(x + xSpacer * i, y, initialTosses[i+2])
            balls.push(ball)
        }
        return balls
    }

    draw() {
        ellipse(this.x, this.y - this.toss.func(this.position), 20, 20)
        this.stepToss()
    }
}

class JugglePattern {
    constructor(sequence) {
        this.sequence = sequence
        this.tosses = tosses
        this.index = 0
    }

    next() {
        if (this.index == this.sequence.length - 1) this.index = 0
        else this.index += 1
        return this.sequence[this.index]
    }
}

const winWidth = 800
const winHeight = 450

const h = 5;
const duration = 30;
const tosses = JuggleToss.getTosses(h, duration)
const jugglePattern = new JugglePattern([3, 3, 3]);

const xSpacer = 30
const xAnchor = winWidth / 2 - xSpacer * jugglePattern.sequence.length / 2
const yAnchor = 430

let balls = JuggleBall.getBalls(
    xAnchor, xSpacer, yAnchor,
    jugglePattern.sequence.length,
    h, duration);
for (let ball of balls) {
    console.log(ball.toss.func == null)
    ball.onComplete = () => {
        console.log(ball.toss.func)
        ball.toss = tosses[jugglePattern.next()]
    }
}

function setup() {
    stroke(0);
    const canvas = createCanvas(winWidth, winHeight)
    canvas.parent('sketch-holder');
    canvas.style("display", "block");
}

function draw() {
    background(220)
    balls.forEach(ball => ball.draw())
    line(0, 440, winWidth, 440)
}