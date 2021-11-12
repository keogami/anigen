import Component from "./component.js"

class Circle extends Component {
  constructor({ color, turn, size, pos, tween, transform }) {
    super({ tween })
    this.color = color ?? "black"
    this.size = size ?? (() => {throw new Error("radius not set")})()
    this.pos = pos ?? (() => {throw new Error("pos not set")})()
    this.transform = transform ?? (() => {})
    this.rotation = turn ?? Math.PI * 2
  }

  draw({ ctx }) {
    ctx.beginPath()
    this.transform(ctx)
    ctx.fillStyle = this.color.toString()

    ctx.arc(this.pos.x, this.pos.y, this.size, 0, this.rotation)

    ctx.fill()
    ctx.closePath()
  }
}

export { Circle }