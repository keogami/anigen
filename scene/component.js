class Component {
  constructor({ tween }) {
    this.tween = tween
  }

  tick(frameID) {
    const mutate = this.tween.mutator(frameID)
    if (mutate === null) {
      return true
    }

    mutate(this)
    return false
  }

  draw(drawArg) {
    throw new Error("Component's draw method wasn't implemented")
  }
}

export default Component