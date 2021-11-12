class Timeline {
  constructor() {
    this._scene = new Set()
    this._waiting = new Map()
  }

  schedule(frameID, component) {
    frameID = Math.round(frameID) // avoid floats, cuz they can fuck everything
    if (!this._waiting.has(frameID)) {
      this._waiting.set(frameID, new Set())
    }
    this._waiting.get(frameID).add(component)
  }

  _stageFromWaiting(frameID) {
    if (!this._waiting.has(frameID)) {
      return // nothing to stage to scene
    }

    for (const comp of this._waiting.get(frameID)) {
      this._scene.add(comp)
    }
  }

  tick(frameID) {
    frameID = Math.round(frameID)
    this._stageFromWaiting(frameID)
    for (const comp of this._scene) {
      const end = comp.tick(frameID)
      if (!!end) {
        this._scene.delete(comp)
      }
    }
  }

  draw(drawObjArg) {
    for (const comp of this._scene) {
      drawObjArg.ctx.save()
      comp.draw(drawObjArg)
      drawObjArg.ctx.restore()
    }
  }

  clean(ctx) {
    ctx.beginPath()
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fill()
    ctx.closePath()
  }

  record({ ctx, endTime, name }) {
    if (!cvg) {
      throw new Error("cvg is not loaded")
    }
    if (!ctx || !endTime) {
      throw new Error("either context or endtime was not provided")
    }
    const that = this
    name ??= "video"
    console.log("starting recording")
    let frameID = 0
    function frame() {
      if (frameID > endTime) {
        cvg.render(name)
        console.log("animation recording ended")
        return
      }

      try {
        that.tick(frameID)
        that.clean(ctx)
        that.draw({ ctx, endTime })
        cvg.addFrame(ctx.canvas, () => requestAnimationFrame(frame))
        frameID += 1
      } catch(err) {
        console.log("Error occured while recording the animation")
        console.error(err)
        return
      }
    }
    requestAnimationFrame(frame)
  }

  run(drawObjArg) {
    const fps = drawObjArg.config.fps
    const mspf = 1000 / fps // milliseconds per frame
    let start = null, last = null
    let frameID = 0
    const that = this
    function frame(timestamp) {
      if (drawObjArg.endTime && frameID > drawObjArg.endTime) {
        console.log("animation ended")
        return
      }
      const id = requestAnimationFrame(frame)
      if (start === null) {
        start = timestamp
        last = timestamp
      }
      const et = (timestamp - start)
      const etlast = (last - start)

      if ((et - etlast) >= mspf) {
        drawObjArg.ctx.clearRect(0, 0, drawObjArg.config.width, drawObjArg.config.height)
        try {
          that.tick(frameID)
          that.draw(drawObjArg)
        } catch(err) {
          console.log("Error occured while running the animation")
          console.error(err)
          cancelAnimationFrame(id)
        }
        frameID += 1
        last = timestamp
      }
    }
    requestAnimationFrame(frame)
  }
}

export { Timeline }