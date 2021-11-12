class Tween {
  constructor({ frames, easing }) {
    this.frames = frames
    this.easing = easing
  }
  
  mutator(frameID) {
    throw new Error("Unextended tween called")
  }
}

class Property extends Tween {
  constructor({ frames, easing, setter, from, to }) {
    super({ frames, easing })
    this.setter = setter
    this.from = from
    this.to = to
    this.delta = this.to - this.from
  }

  mutator(frameID) {
    const t = Math.min(1.0, frameID / this.frames)
    if (t >= 1.0) {
      return null
    }

    const it = this.easing(t)
    const diff = (this.delta * it.y) + this.from

    return comp => {
      this.setter({ diff, comp })
    }
  }
}

class VectorProperty extends Tween {
  constructor({ frames, easing, from, to, setter }) {
    super({ frames, easing })
    this.from = from
    this.to = to
    this.delta = to.clone().subtract(from)
    this.setter = setter
  }

  mutator(frameID) {
    const t = Math.min(1.0, frameID / this.frames)
    if (t >= 1.0) {
      return null
    }
    
    const it = this.easing(t)
    const diff = this.delta.clone().scale(it.y).add(this.from)

    return comp => {
      this.setter({ diff, comp })
    }
  }
}

class Translate extends VectorProperty {
  constructor({ frames, easing, from, to }) {
    super({ frames, easing, from, to, setter: ({ comp, diff }) => {
      comp.pos = diff
    } })
  }
}

class RectScale extends VectorProperty {
  constructor({ frames, easing, from, to }) {
    super({ frames, easing, from, to, setter: ({ comp, diff }) => {
      comp.rect = diff
    } })
  }
}

class SizeScale extends Property {
  constructor({ frames, easing, from, to }) {
    super({ frames, easing, from, to, setter: ({ comp, diff }) => {
      comp.size = diff
    } })
  }
}

class Rotate extends Property {
  constructor({ frames, easing, from, to }) {
    super({ frames, easing, from, to, setter: ({ comp, diff }) => {
      comp.rotation = diff
    } })
  }
}

class Delay extends Tween {
  constructor({ frames }) {
    super({ frames, easing: null })
  }

  mutator(frameID) {
    if (frameID > this.frames) {

      return null
    }
    return () => {}
  }
}

class Stay extends Delay {
  constructor() {
    super({ frames: Number.POSITIVE_INFINITY })
  }
}

class Merge extends Tween {
  constructor(...tweens) {
    super({})
    this._tweens = tweens
  }

  mutator(frameID) {
    const mutators = this._tweens.map(it => it?.mutator(frameID))
    const alive = mutators.filter(it => it instanceof Function)
    if (alive.length === 0) { // all of them ended
      return null
    }

    return comp => {
      alive.map(it => it(comp))
    }
  }
}

class Alpha extends Property {
  constructor(options) {
    super({ ...options, setter: ({ comp, diff }) => {
      comp.color.alpha = diff
    } })
  }
}

export {
  Property, VectorProperty, Translate, Delay, Stay, Rotate, Merge,
  RectScale, SizeScale, Alpha
}