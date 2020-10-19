
// Creates array of stair vertices centered at (0,0)
// Height and width of each "step" is 1
function stairCoords(n) {
    let coords = [{x:0, y:0}]
    for(let i=1; i < n/2; i++) {
        coords.push({x: i, y: i-1})
        coords.push({x: i, y: i})
        coords.unshift({x: -i+1,  y: -i})
        coords.unshift({x: -i,    y: -i})
    }
    return coords
}

function scaleCoords(coords, scalar) {
    return coords.map(coord => {
        let newCoord = {
            x: coord.x * scalar,
            y: coord.y * scalar
        }
        return newCoord
    })
}

function translateCoords(coords, deltaX, deltaY) {
    return coords.map(coord => {
        let newCoord = {
            x: coord.x + deltaX,
            y: coord.y + deltaY
        }
        return newCoord
    })
}

function drawSteps(coords) {
    for (let i=1; i < coords.length; i++) {
        line(coords[i].x, coords[i].y, coords[i-1].x, coords[i-1].y)
    }
}

function drawStairs(coordsA, coordsB) {
    let isShaded = true
    for(let i=0; i<coordsA.length-1; i++) {
        if (isShaded) fill(230)
        else          fill(255)
        isShaded = !isShaded

        let a0 = coordsA[i]
        let b0 = coordsB[i]
        let a1 = coordsA[i+1]
        let b1 = coordsB[i+1]
        quad(a0.x, a0.y, b0.x, b0.y, b1.x, b1.y, a1.x, a1.y)
  }
}

function setup() {
  createCanvas(800, 450);
  frameRate(30)
  strokeWeight(1)
  fill(255) 
}

let shift = 0
let shiftDelta = 0.05

function draw() {
    let coords = translateCoords(stairCoords(50), shift, shift)

    let coordsA = translateCoords(
        scaleCoords(coords, 20),
        360, 20 * 15
    )
    let coordsB = translateCoords(
        scaleCoords(coords, 20*0.87),
        460, 20*0.87*15
    )

    background(0);
    isShaded = true
    drawStairs(coordsA, coordsB)

    // lol, the questionable precision of floating point numbers
    if (shift > 0.9499) shift = 0
    else shift += shiftDelta
}

