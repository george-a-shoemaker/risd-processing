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
const jugglePattern = new JugglePattern([2,9,5,4,3,1]);

const xSpacer = 30
const xAnchor = winWidth / 2 - xSpacer * jugglePattern.sequence.length / 2
const yAnchor = 430

const osc = new p5.Oscillator('sine');
console.log(osc == null)

let balls = JuggleBall.getBalls(
    xAnchor, xSpacer, yAnchor,
    jugglePattern.sequence.length,
    h, duration);

 let oscs = [196, 247, 294, 349, 440, 523].map(
    hertz => new p5.Oscillator(hertz, 'sine')
)

let decay = (duration-1)/fps
for (let i=0; i<balls.length; i++) {
    balls[i].onComplete = () => {
        balls[i].toss = tosses[jugglePattern.next()]
        oscs[i].start()
        oscs[i].amp(0)
        oscs[i].amp(0.2,0.05)
        oscs[i].amp(0,decay)
        oscs[i].stop(0.5)
    }
}

let sequenceString = 'Sequence: [' + jugglePattern.sequence.join(', ') + ']'

// let button;

function setup() {
    stroke(0);
    frameRate(frameRate);
    console.log(userStartAudio == null)
    userStartAudio();
   
    console.log(osc == null)
    const canvas = createCanvas(winWidth, winHeight)
    canvas.parent('sketch-holder');
    canvas.style("display", "block");

    // button = createButton('go');
    // // button.position(_renderer.x, _renderer.y);

    // let pos = _renderer.position()
    // button.position(pos.x, pos.y);
    // button.mousePressed(()=>console.log("yeet!"));

    // console.log(pos.x)
    // console.log(pos.y)

    for (that in this) console.log(that)
}

function draw() {
    background(220)
    text(sequenceString, 660, 20)
    balls.forEach(ball => ball.draw())
    line(0, 440, winWidth, 440)
}

function mousePressed() {
    userStartAudio();
  }