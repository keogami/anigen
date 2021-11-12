import { Vector } from "./vector.js"

const p0 = new Vector(0, 0)
const p3 = new Vector(1, 1)

const cubicBezier = (x1, y1, x2, y2) => {
  const p1 = new Vector(x1, y1)
  const p2 = new Vector(x2, y2)
  return (t) => {
    const tt = t * t, ttt = tt * t, u = 1 - t, uu = u * u// uuu = uu * u
    return (p0.clone()
      // .scale(uuu) // p0 is always 0 so no point in scalling
      .add(p1.clone().scale(3 * uu * t))
      .add(p2.clone().scale(3 * tt * u))
      .add(p3.clone().scale(ttt))
    )
  }
}


const Interpolate = Object.freeze({
  cubicBezier,
  linear: cubicBezier(.333, .333, .666, .666),
  ease: cubicBezier(.25, .1, .25, 1.0),
  easeInOut: cubicBezier(.42, 0.0, .58, 1.0),
})

export { Interpolate as default }