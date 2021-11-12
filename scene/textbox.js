import Component from "./component.js"

class TextBox extends Component {
  constructor({ text, color, pos, tween, transform, font, align, baseline }) {
    super({ tween })
    this.color = color ?? "black"
    this.pos = pos ?? (() => {throw new Error("pos not set")})()
    this.text = text ?? (() => {throw new Error("text not set")})()
    this.transform = transform ?? (() => {})
    this.font = font
    this.align = align ?? "start"
    this.baseline = baseline ?? "alphabetic"
  }

  draw({ ctx }) {
    ctx.beginPath()
    this.transform(ctx)
    ctx.fillStyle = this.color.toString()

    ctx.textAlign = this.align
    ctx.textBaseline = this.baseline
    ctx.font = this.font.toString()

    ctx.fillText(this.text, this.pos.x, this.pos.y)

    ctx.fill()
    ctx.closePath()
  }
}

TextBox.Font = class {
  constructor({ size, family, style }) {
    this.size = size ?? 10
    this.family = family ?? "sans-serif"
    this.style = style
  }

  toString() {
    const out = `${this.size}px ${this.family}`
    if (this.style) {
      return `${this.style} ${out}`
    }
    return out
  }
}

export { TextBox }