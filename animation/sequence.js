class SequenceResolver {
  constructor() {
    this.__iterator = null
    this.__currentTween = null
    this.__frameStart = null
    this.__ended = false
  }

  iterator() {
    throw new Error("iterator method was not implemented")
  }

  __setNextTween(frameID) {
    const item = this.__iterator.next()
    if (item.done) {
      return !item.done
    }
    this.__currentTween = item.value
    this.__frameStart = frameID
    return true
  }

  mutator(frameID) {
    if (this.__ended) {
      return null
    }

    if (this.__iterator === null) {
      this.__iterator = this.iterator()
      if (!this.__setNextTween(frameID)) { // empty for whatever reason
        return null
      }
    }

    let res
    do {
      res = this.__currentTween.mutator(frameID - this.__frameStart)
    } while (res === null && this.__setNextTween(frameID))

    if (res === null) {
      this.__ended = true
    }
    return res
  }
}

class Static extends SequenceResolver {
  constructor(tweens) {
    super()
    this._tweens = new Set(tweens)
  }

  add(tween) {
    this._tweens.add(tween)
  }

  iterator() {
    return this._tweens[Symbol.iterator]()
  }
}

class Dynamic extends SequenceResolver {
  constructor(generator) {
    super()
    this.generator = generator
  }

  iterator() {
    return this.generator()
  }
}

export default Object.freeze({
  Dynamic, Static
})