class JuggleBall extends Jugglable {
    constructor(x, y, toss, ballWidth) {
        super(toss)
        this.x = x
        this.y = y
        this.colorScalar = 1
        this.ballWidth = ballWidth
    }

    static getColor(colorScalar) {
        return color(255, 255*colorScalar, 255*colorScalar)
    }

    static getBalls(x, xSpacer, y, n, h, duration, ballWidth) {
        let balls = []
        let initialTosses = JuggleToss.getTosses(h, duration)
        for (let i=0; i<n; i++) {
            let ball = new JuggleBall(x + xSpacer * i, y, initialTosses[i+2], ballWidth)
            balls.push(ball)
        }
        return balls
    }

    draw() {
        this.colorScalar = constrain(this.colorScalar+0.05, 0, 1)
        fill(JuggleBall.getColor(this.colorScalar))
        ellipse(this.x, this.y - this.toss.func(this.position), this.ballWidth, this.ballWidth)
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

const h = 4;
const duration = 30;
const tosses = JuggleToss.getTosses(h, duration)
const jugglePattern = new JugglePattern([1,2,5,6,8,4,2,1]);

const ballWidth = 52
const xSpacer = 76
const xAnchor = winWidth / 2 - xSpacer * jugglePattern.sequence.length / 2 + ballWidth*3/4
const yAnchor = 410

const osc = new p5.Oscillator('sine');
console.log(osc == null)

let balls = JuggleBall.getBalls(
    xAnchor, xSpacer, yAnchor,
    jugglePattern.sequence.length,
    h, duration, ballWidth);

 let oscs = [220, 261.626, 329.628, 391.995, 493.883, 587.33, 698.456, 880, 1046.502, 1318.51].map(
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
        balls[i].colorScalar = 0;
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
    background(20)
    fill(255);
    noStroke();
    text(sequenceString, 10, 20)
    balls.forEach(ball => ball.draw())
    stroke(150,0,0)
}

function mousePressed() {
    userStartAudio();
  }