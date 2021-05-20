// ----- Triangles model -----

const TRIANGLE_SIZE = 80
const BASE_COLOR = '#333'

const triangles = []

const forEachTriangle = function (func) {
  for (var c = 0; c < triangles.length; c++) {
    for (var r = 0; r < triangles[c].length; r++) {
      func(triangles[c][r], c, r)
    };
  };
}

const getTriangleAtCoordinates = function (x, y) {
  const c = Math.round(x / TRIANGLE_SIZE * 2)
  const r = Math.round(y / TRIANGLE_SIZE)
  return {
    triangle: triangles[c][r],
    c,
    r
  }
}

const setTriangle = function (c, r, value) {
  triangles[c][r] = value
}

const initTriangleData = function (canvas) {
  const columns = canvas.width / TRIANGLE_SIZE * 2
  const rows = canvas.height / TRIANGLE_SIZE * 2
  for (var c = 0; c < columns; c++) {
    triangles[c] = []
    for (var r = 0; r < rows; r++) {
      triangles[c][r] = 0
    };
  };
}

const updateTriangleData = function () {
  forEachTriangle(function (triangle, c, r) {
    if (triangle > 0) {
      setTriangle(c, r, Math.max(0, triangle - 0.02))
    }
  })
}

// ----- Drawing -----

const fillCanvas = function (canvas, context, color = 'white') {
  context.fillStyle = color
  context.fillRect(0, 0, canvas.width, canvas.height)
}

const drawTriangle = function (context, x, y, size = 100, flipped = false, fillStyle = '#FFCC00', debugText) {
  const TRI_HEIGHT = 0.35
  const FLIP_ADJUST = -0.16 * TRIANGLE_SIZE
  // Triangle coordinates
  context.beginPath()
  if (!flipped) {
    context.moveTo(x, y - size / 2)
    context.lineTo(x - size / 2, y + size * TRI_HEIGHT)
    context.lineTo(x + size / 2, y + size * TRI_HEIGHT)
  } else {
    // Upside down
    context.moveTo(x, y + size / 2 + FLIP_ADJUST)
    context.lineTo(x - size / 2, y - size * TRI_HEIGHT + FLIP_ADJUST)
    context.lineTo(x + size / 2, y - size * TRI_HEIGHT + FLIP_ADJUST)
  }
  context.closePath()
  // Fill it with color
  context.fillStyle = fillStyle
  context.fill()
  // Debug
  // context.beginPath();
  // context.arc(x, y, 2, 0, 2*Math.PI);
  // context.fill();
  // context.fillStyle = 'tomato';
  // context.font = '10px Arial';
  // if (debugText) context.fillText(debugText, x, y);
}

const drawAllTriangles = function (context) {
  const HEIGHT_CONSTANT = 0.85
  forEachTriangle(function (triangle, c, r) {
    const baseColor = tinycolor(BASE_COLOR)
    const triangleColor = baseColor.lighten(triangle * 20)
    drawTriangle(context, c * TRIANGLE_SIZE / 2, TRIANGLE_SIZE / 2 + r * TRIANGLE_SIZE * HEIGHT_CONSTANT, TRIANGLE_SIZE, (c % 2 === 1), triangleColor.toHexString(), `${triangle * 10}`)
  })
}

// ----- Mouse -----

// From https://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
const getMousePos = function (canvas, event) {
  const rect = canvas.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

const initMouse = function (canvas, context) {
  canvas.addEventListener('mousemove', function (event) {
    const mousePos = getMousePos(canvas, event)
    const triangleData = getTriangleAtCoordinates(mousePos.x, mousePos.y)
    setTriangle(triangleData.c, triangleData.r, 1)
  }, false)
}

// ----- Main -----

const initCanvas = function (canvas, context) {
  initTriangleData(canvas)
  initMouse(canvas, context)
  fillCanvas(canvas, context, BASE_COLOR)
}

const updateCanvas = function (canvas, context, frameCount) {
  updateTriangleData()
  drawAllTriangles(context)
}
