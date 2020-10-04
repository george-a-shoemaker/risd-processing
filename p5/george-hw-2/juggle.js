class Parabola {
    static basic(x) { return -Math.pow(x - 1, 2) + 1 }
    static getWidthScalar(w) { return Math.pow(w / 2, -1) }
    static getScaled(h, w) {
        let widthScalar = Parabola.getWidthScalar(w)
        return function (x) {
            return Parabola.basic(x * widthScalar) * h
        }
    }
}

class JuggleToss {
    static getTosses(h, duration) {
        let tosses = []
        for (var i = 0; i <= 12; i++) {
            let toss = new JuggleToss(i, h, duration)
            tosses.push(toss)
        }
        return tosses
    }

    constructor(tossIndex, h_1, duration_1) {
        let h = h_1 * tossIndex * tossIndex
        this.duration = duration_1 * tossIndex
        this.func = Parabola.getScaled(h, this.duration)

    }
}

class Jugglable {
  constructor(toss) {
    this.toss = toss
    this.position = 0
  }

  step() {
    if (this.position >= this.toss.duration - 1) return this.reset()
    this.position += 1
  }

    reset() { this.position = 0 }

    set(x) {
        if (x < 0 || x >= duration) return this.reset()
        this.position = x
    }
}
