function findOptimalResolution(rect, viewport) {
  // has an edge case where rect.x may still not fit even after height check
  if (rect.y > viewport.y) { // height check
    const newRectY = viewport.y
    const scale = newRectY / rect.y
    const newRectX = rect.x * scale
    return {
      x: newRectX, y: newRectY,
    }
  }
  if (rect.x > viewport.x) { // width check
    const newRectX = viewport.x
    const scale = newRectX / rect.x
    const newRectY = rect.y * scale
    return {
      x: newRectX, y: newRectY,
    }
  }
  return {
    x: rect.x, y: rect.y
  }
}

export { findOptimalResolution }