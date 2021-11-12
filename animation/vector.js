class Vector {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  clone() {
    return new Vector(this.x, this.y)
  }

  scale(s) {
    this.x *= s
    this.y *= s
    return this
  }

  add(vec) {
    this.x += vec.x
    this.y += vec.y
    return this
  }

  subtract(vec) {
    this.x -= vec.x
    this.y -= vec.y
    return this
  }

  hypot() {
    return Math.hypot(this.x, this.y)
  }
}

export { Vector }