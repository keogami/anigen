import Component from "./component.js"

class Box extends Component {
  constructor({ color , rect, pos, tween, transform }) {
    super({ tween })
    this.color = color ?? "black"
    this.rect = rect ?? (() => {throw new Error("rect not set")})()
    this.pos = pos ?? (() => {throw new Error("pos not set")})()
    this.transform = transform ?? (() => {})
  }

  draw({ ctx }) {
    ctx.beginPath()
    this.transform(ctx)
    ctx.fillStyle = this.color.toString()

    ctx.fillRect(this.pos.x, this.pos.y, this.rect.x, this.rect.y)

    ctx.fill()
    ctx.closePath()
  }
}

export { Box }