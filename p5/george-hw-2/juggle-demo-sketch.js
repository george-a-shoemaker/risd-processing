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
const balls = JuggleToss.getTosses(h, duration).map(
  (toss, i) => new JuggleBall(i * 30, 750, toss)
)

function setup() {
  stroke(0);
  const canvas = createCanvas(400, 800);
  canvas.parent('sketch-holder');
  canvas.style("display", "block");
    // Inject canvas into <div> marked with 'sketch-holder' class
}

function draw() {
  background(220)
  balls.forEach(ball => ball.draw())
  line(0, 760, 400, 760)
}

console.log("juggle-demo-sketch.js loaded")