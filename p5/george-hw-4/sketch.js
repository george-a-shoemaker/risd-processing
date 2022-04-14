// George Shoemaker
// Schnekk
// April 2020, covid-19 lockdown

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static setupPrototype(cellSize, canvasOffset) {
        Cell.prototype.size = cellSize
        Cell.prototype.canvasOffset = canvasOffset
        Object.defineProperty(Cell.prototype, "anchorX", {
            get: function() {  return this.x * this.size + this.canvasOffset},
        })
        Object.defineProperty(Cell.prototype, "anchorY", {
            get: function() {  return this.y * this.size + this.canvasOffset},
        })
        Cell.prototype.draw = function(color, cornerR) {
            fill(color)
            strokeWeight(0)
            rect(this.anchorX, this.anchorY, cellSize, cellSize, cornerR);
        }

        Cell.prototype.equalTo = function(that) {
            return this.x === that.x && this.y === that.y
        }
        Cell.prototype.hashKey = function() {
            return this.x.toString() + ',' + this.y.toString()
        }
    }
}

class EyeDrawer {
    static drawSquareEye(cell, dir) {
        return () => { 
            const halfSize = cell.size/2
            let x = cell.anchorX + halfSize/2
            let y = cell.anchorY + halfSize/2

            fill(color('white')) 
            noStroke()
            rect(x,y, halfSize, halfSize)

            fill(color('black'))
            x = cell.anchorX + halfSize/4 + halfSize/2
            y = cell.anchorY + halfSize/4 + halfSize/2

            switch (dir) {
                case 0: x-=3; break;
                case 1: y-=3; break;
                case 2: x+=3; break;
                case 3: y+=3;
            }

            rect(x, y, halfSize/2, halfSize/2)
        }
    }
    static drawClosedEye(cell, dir) {
        return () => {
            const halfSize = cell.size/2
            let centerX = cell.anchorX + halfSize
            let centerY = cell.anchorY + halfSize 
    
            stroke(color('black')) 
            let x1 = centerX
            let y1 = centerY
            let x2 = centerX
            let y2 = centerY
    
            switch (dir) {
                case 0: case 2: x1-=3.5; x2+=3.5; break;
                case 1: case 3: y1-=3.5; y2+=3.5;
            }
    
            stroke(color('black'))
            strokeWeight(1.8)
            line(x1, y1, x2, y2)

            strokeWeight(0)
        }
    }
    static drawDeadEye(cell) {
        return () => {
            let thirdSize = cell.size/3
            let x1 = cell.anchorX + thirdSize
            let y1 = cell.anchorY + thirdSize
            let x2 = x1 + thirdSize
            let y2 = y1 + thirdSize

            stroke(color('black'))
            strokeWeight(1.5)
            line(x1, y1, x2, y2)
            line(x1, y2, x2, y1)
        }
    }
}


class Game {
    constructor(width, height, cellSize) {
        this.baseSpeed = 5
        this.speedScalar = 1
        this.isSlow = true
        this.width = width;
        this.height = height;
        this.reset();

        const scoreX =  width * cellSize - 40;
        const scoreY = height * cellSize - 22;

        this.drawScore = () => {
            fill(color('#dd0'))
            strokeWeight(3)
            stroke(0)
            textSize(16)
            text(this.score, scoreX, scoreY); 
        }

        this.drawGameOver = () => {
            fill(color("#dd0"))
            strokeWeight(3)
            stroke(0)
            textSize(24)
            text(`You got Schnekk'd !!`, 100, 190)
            text('Score: ' + this.score, 170, 230)
            text('Length: ' + this.snake.body.length, 165, 270)

        }

        let speedX = 30
        let speedY = height * cellSize - 22

        this.drawSpeed = () => {
            fill(color("#dd0"))
            strokeWeight(3)
            stroke(0)
            textSize(16)

            text(`x${this.speedScalar}`, speedX, speedY)
        }
    }

    reset() {
        this.setPause(false)
        this.isOver = false
        this.score = 0
        this.snake = new Snake(new Cell(1,9))
        this.snake.pushHead(new Cell(2,9))
        this.dir = 2
        this.nextDir = this.dir
        this.apple = new Cell(12,9)
        this.resetOpenSpacesDict(this.snake.body)
    }

    resetOpenSpacesDict(occupiedCells) {
        this.openSpacesDict = {}
        for(let i=0; i<this.width; i++) {
            for(let j=0; j<this.height; j++) {
                const newCell = new Cell(i,j)
                this.openSpacesDict[newCell.hashKey()] = newCell
            }
        }
        for (const cell of occupiedCells) {
            delete this.openSpacesDict[cell.hashKey()]
        }
       
    }

    get fps() { return this.baseSpeed * this.speedScalar }

    setPause(bool) {
        this.isPaused = bool
        frameRate( bool ? 0 : this.fps )
    }

    togglePause() { this.setPause(!this.isPaused) }

    isInBounds(cell) {
        return cell.x >=0 && cell.x < this.width && cell.y >= 0 && cell.y < this.height
    }

    get randomOpenCell() {
        return this.openSpacesDict[random(Object.keys(this.openSpacesDict))]
    }

    input(keyCode) {
        if (this.isPaused) return
        if (keyCode < LEFT_ARROW || keyCode > DOWN_ARROW) { return }
        this.nextDir = keyCode - 37
    }

    onEatApple() {
        
    }
    
    step() {

        let head = this.snake.getHead()
        let x = head.x
        let y = head.y

        // Ignore nextDir if it opposes dir
        if (this.nextDir + 2 != this.dir && this.nextDir - 2 != this.dir) {
            this.dir = this.nextDir
        }

        switch (this.dir) {
            case 0: x--; break;
            case 1: y--; break;
            case 2: x++; break;
            case 3: y++; break;
        }

        let newHead = new Cell(x, y)

        if (!this.isInBounds(newHead)) {
            this.isOver = true;
            return
        }

        // check newHead for body collision
        for (const cell of this.snake.body) {
            if (cell.equalTo(newHead)) {
                this.isOver = true
                return
            }
        }

        const oldTail = this.snake.popTail()
        this.openSpacesDict[oldTail.hashKey()] = oldTail
    
        this.snake.pushHead(newHead)
        delete this.openSpacesDict[newHead.hashKey()]

        // check for growth
        for (const key in this.snake.eatenAppleDict) {
            const openCell = this.openSpacesDict[key]
            if (openCell) {
                this.snake.pushTail(openCell)
                delete this.snake.eatenAppleDict[key]
            }
        }

        // check for eaten apple
        if (this.apple.equalTo(newHead)) {
            this.score += this.speedScalar*10
            this.snake.eatenAppleDict[newHead.hashKey()] = newHead
            this.apple = this.randomOpenCell
            this.justAte = true
        } else {
            this.justAte = false
        }
    }

    setSpeedScalar(scalar) {
        this.speedScalar = scalar
        frameRate(this.fps)
    }
    
    draw() {
        if (!this.isOver) this.step()

        let head = this.snake.getHead()
        let drawEye = (() => {
            if (this.isOver)  return EyeDrawer.drawDeadEye(head)
            if (this.justAte) return EyeDrawer.drawClosedEye(head, this.dir)
                              return EyeDrawer.drawSquareEye(head, this.dir)
        })()

        this.snake.draw(color('#0b0'), drawEye)
        this.apple.draw(color('#e00'))
        this.drawScore()
        this.drawSpeed()
        if (this.isOver) this.drawGameOver()
    }
}


class Snake {
    constructor(initialCell) {
        this.body = [initialCell]
        this.eatenAppleDict = {}
    }

    getHead() { return this.body[0] }
    getTail() { return this.body[this.body.length - 1] }
    pushHead(cell) { this.body.unshift(cell) }
    pushTail(cell) { this.body.push(cell) }
    popTail() { return this.body.pop() }
    draw(snakeColor, drawEye) {
        for (const cell of this.body) { cell.draw(snakeColor) }
        for (const key in this.eatenAppleDict) {
            this.eatenAppleDict[key].draw(color('#080'))
        }
        drawEye()
    }
}


// ===================
// GAME SETUP AND LOOP
// ===================
let game;
let keyPressDict = {}

function setup() {
    
    const canvas = createCanvas(416, 416);
    let canvasOffset = 8
    let canvasDim = 400;
    canvas.parent('sketch-holder')

    background(10);

    let cellSize = 20
    Cell.setupPrototype(cellSize, canvasOffset)
    let gameDim = floor(canvasDim/cellSize)
    game = new Game(gameDim, gameDim, cellSize)

    frameRate(game.fps); 

    // Add game state controls
    keyPressDict[49] = () => game.setSpeedScalar(1)  // '1' key
    keyPressDict[50] = () => game.setSpeedScalar(2)  // '2' key 
    keyPressDict[51] = () => game.setSpeedScalar(3)  // '3'
    keyPressDict[32] = () => game.togglePause(false) // 'SPACE'
    keyPressDict[13] = () => game.reset()  // 'ENTER'

}

function draw() {
    background(10);
    strokeWeight(8);
    noFill()
    stroke(color('#777'))
    rect(4, 4, 408, 408)
    game.draw()
}

function keyPressed() {
    const callback = keyPressDict[keyCode]
    if (callback) callback()
    game.input(keyCode)
}