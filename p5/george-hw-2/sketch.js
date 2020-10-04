class JuggleBall extends Jugglable {
    constructor(x, y, toss) {
        super(toss)
        this.x = x
        this.y = y
    }

    draw() {
        ellipse(this.x, this.y - this.toss.func(this.position), 20, 20)
        this.step()
    }
}

const h = 10;
const duration = 30;
const tosses = JuggleToss.getTosses(h, duration)
let ball = new JuggleBall(20, 430, tosses[2])

function setup() {
    stroke(0);
    const canvas = createCanvas(800, 450);
    canvas.parent('sketch-holder');
    canvas.style("display", "block");
}

function draw() {
    background(220)
    ball.draw()
    line(0, 430, 800, 430)
}