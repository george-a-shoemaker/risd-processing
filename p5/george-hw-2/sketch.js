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
const fps = 60

const h = 5;
const duration = 30;
const tosses = JuggleToss.getTosses(h, duration)
const jugglePattern = new JugglePattern([1,9,7,5,3]);

const xSpacer = 30
const xAnchor = winWidth / 2 - xSpacer * jugglePattern.sequence.length / 2
const yAnchor = 430

const osc = new p5.Oscillator('sine');
console.log(osc == null)

let balls = JuggleBall.getBalls(
    xAnchor, xSpacer, yAnchor,
    jugglePattern.sequence.length,
    h, duration);

let oscs = [196, 220, 247, 262, 294, 330, 349, 392, 440, 494, 523].map(
    hertz => new p5.Oscillator(hertz, 'sine')
)

let decay = (duration-1)/fps
for (let i=0; i<balls.length; i++) {
    balls[i].onComplete = () => {
        balls[i].toss = tosses[jugglePattern.next()]
        oscs[i].start()
        oscs[i].amp(1)
        oscs[i].amp(0,decay)
        oscs[i].stop(0.5)
    }
}

function setup() {
    stroke(0);
    frameRate(frameRate);
   
    console.log(osc == null)
    const canvas = createCanvas(winWidth, winHeight)
    canvas.parent('sketch-holder');
    canvas.style("display", "block");
}

function draw() {
    background(220)
    balls.forEach(ball => ball.draw())
    line(0, 440, winWidth, 440)
}