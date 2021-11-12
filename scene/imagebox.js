import Component from "./component.js"

class ImageBox extends Component {
  constructor({ imagesrc, clipping, rect, pos, tween, transform }) {
    super({ tween })
    this.rect = rect ?? null // if not set, the original size is drawn
    this.pos = pos ?? (() => {throw new Error("pos not set")})()
    this.transform = transform ?? (() => {})
    this.imagesrc = imagesrc ?? (() => {throw new Error("imagesrc not set")})()
    this.clipping = clipping ?? null // if not set, no clipping would be used
  }

  draw({ ctx }) {
    ctx.beginPath()
    this.transform(ctx)
    ctx.fillStyle = this.color

    // maybe i should precalculate this if-tree but fuck it
    // what if i wanted the clipping is to be used after a few frames, so eh
    if (this.rect !== null && this.clipping !== null) {
      // yup, thats a lot of fucking arguments but, dont blame me, blame the API
      console.log("a")
      ctx.drawImage(
        this.imagesrc,
        this.clipping.pos.x, this.clipping.pos.y,
        this.clipping.rect.x, this.clipping.rect.y,
        this.pos.x, this.pos.y,
        this.rect.x, this.rect.y
      )
    } if (this.rect !== null) {
      ctx.drawImage(
        this.imagesrc,
        this.pos.x, this.pos.y,
        this.rect.x, this.rect.y
      )
    } else if (this.clipping !== null) {
      // there's no `drawImage` variant for this case
      throw new Error("no drawImage variant for the case: the clipping property is set, but the rect property is not")
    } else {
      console.log("c")
      ctx.drawImage(
        this.imagesrc, this.pos.x, this.pos.y
      )
    }

    ctx.fill()
    ctx.closePath()
  }
}

ImageBox.Clipping = class {
  constructor(pos, rect) {
    this.pos = pos
    this.rect = rect
  }
}

export { ImageBox }