class JuggleBall extends Jugglable {
    constructor(x, y, toss, ballWidth) {
        super(toss)
        this.x = x
        this.y = y
        this.colorScalar = 1
        this.ballWidth = ballWidth
    }

    static getColor(colorScalar) {
        return color(250*colorScalar, 250*colorScalar, 250)
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
        let prev = this.index
        if (this.index == this.sequence.length - 1) this.index = 0
        else this.index += 1
        return this.sequence[prev]
    }
}

function parseInput(str) {
    if (str == null || str.length == 0) return null
    let filtered = str.replace(/[^1-9]/gi, '')
    if (filtered.length > 10) filtered = filtered.substring(0,10)
    return filtered
}

const winWidth = 800
const winHeight = 450
const fps = 30

const h = 4;         //   height of the lowest toss
const duration = 15; // duration of the lowest toss
const tosses = JuggleToss.getTosses(h, duration)
let jugglePattern; //= new JugglePattern([9]);

const ballWidth = 52
const xSpacer = 76
let xAnchor;// = winWidth / 2 - xSpacer * jugglePattern.sequence.length / 2 + ballWidth*3/4
const yAnchor = 410

let balls;



//            C        F          A
let notes = [ 261.626,  349.228,  440,
              523.251,  698.456,  880,
             1046.502, 1396.913, 1760,
             2093.005 ]

let oscs = notes.map( hertz => new p5.Oscillator(hertz, 'sine') )

const decay = (duration-1)/fps

let sequenceString //= '=> Sequence: [' + jugglePattern.sequence.join(', ') + ']'

function setup() {
    stroke(0);
    frameRate(fps);
    console.log(userStartAudio == null)

    jugglePattern = new JugglePattern([9]);
    xAnchor = winWidth / 2 - xSpacer * jugglePattern.sequence.length / 2 + ballWidth*3/4
    
    balls = JuggleBall.getBalls(
        xAnchor, xSpacer, yAnchor,
        jugglePattern.sequence.length,
        h, duration, ballWidth
    );

    for (let i=0; i<balls.length; i++) {
        balls[i].onComplete = () => {
    
            // Not sure why but I perceive higher notes to be louder
            // This is my attempt to normalize that
            const maxAmp = 0.2 - (notes[i]-notes[0])/8000
    
            balls[i].toss = tosses[jugglePattern.next()]
            oscs[i].start()
            oscs[i].amp(0)
            oscs[i].amp(maxAmp,0.05)
            oscs[i].amp(0,decay)
            oscs[i].stop(0.5)
            balls[i].colorScalar = 0;
        }
    }

    const canvas = createCanvas(winWidth, winHeight)
    canvas.parent('sketch-holder');
    canvas.style("display", "block");
    
    let canvasPosition = _renderer.position()
        // This is a hack
        // For whatever reason, the button / input position coords are relative to the DOM, not the canvas

    button = createButton('submit');
    button.position(canvasPosition.x + 184, canvasPosition.y +30);
    input = createInput('');
    input.position(canvasPosition.x + 30, canvasPosition.y+30);

    button.mousePressed( () => {
        let parsed = parseInput(input.value())
        if (parsed == null) return
        let numberArray = parsed.split('').map( c => parseInt(c) )
        jugglePattern = new JugglePattern(numberArray)
        xAnchor = winWidth / 2 - xSpacer * jugglePattern.sequence.length / 2 + ballWidth*3/4

        balls = JuggleBall.getBalls(
            xAnchor, xSpacer, yAnchor,
            jugglePattern.sequence.length,
            h, duration, ballWidth
        );
    
        for (let i=0; i<balls.length; i++) {
            balls[i].onComplete = () => {
        
                // Not sure why but I perceive higher notes to be louder
                // This is my attempt to normalize that
                const maxAmp = (1 -(notes[i]/2000)) * 0.8//- (notes[i]-notes[0])/20000
        
                balls[i].toss = tosses[jugglePattern.next()]
                oscs[i].start()
                oscs[i].amp(0)
                oscs[i].amp(maxAmp,0.05)
                oscs[i].amp(0,decay)
                oscs[i].stop(0.5)
                balls[i].colorScalar = 0;
            }
        }

        sequenceString = numberArray.join(', ')
    });
    textSize(16);
}

function draw() {
    background(20)
    fill(255);
    noStroke();
    text("=>  [" + sequenceString + "]", 228, 25)
    balls.forEach(ball => ball.draw())
    stroke(150,0,0)
}

function mousePressed() {
    userStartAudio();
}