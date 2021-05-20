// ----- Lines model -----

const GRID_RESOLUTION = 15
const BASE_COLOR = '#333'
const LINE_COLOR = '#F0F0F0'

const lines = []

const forEachLinePoint = function (func) {
  for (var r = 0; r < lines.length; r++) {
    for (var c = 0; c < lines[r].length; c++) {
      func(lines[r][c], r, c)
    };
  };
}

const forEachLine = function (func) {
  for (var r = 0; r < lines.length; r++) {
    func(lines[r], r)
  };
}

const getLineAtCoordinates = function (x, y) {
  const c = Math.round(x / GRID_RESOLUTION)
  const r = Math.round(y / GRID_RESOLUTION)
  return {
    line: lines[r][c],
    r,
    c
  }
}

const setLine = function (r, c, value) {
  lines[c][r] = value
}

const initLineData = function (canvas) {
  const columns = canvas.width / GRID_RESOLUTION
  const rows = canvas.height / GRID_RESOLUTION
  console.log(`${rows} rows * ${columns} columns`)
  for (var r = 0; r < rows; r++) {
    lines[r] = []
    for (var c = 0; c < columns; c++) {
      lines[r][c] = 0
    };
  };
}

const updateLineData = function () {
  forEachLinePoint(function (line, r, c) {
    if (line > 0) {
      setLine(r, c, Math.max(0, line - 0.02))
    }
  })
}

// ----- Drawing -----

const fillCanvas = function (canvas, context, color = BASE_COLOR) {
  context.fillStyle = color
  context.fillRect(0, 0, canvas.width, canvas.height)
}

const getPointCoordinates = function (r, c, frameCount) {
  var imageValue = imageData.getPixel(c, r).r ? (imageData.getPixel(c, r).r) / 7.5 : 0
  var sinValue = Math.sin(frameCount / 10 + c / 10) * 10
  var coords = {
    x: c * GRID_RESOLUTION / 2,
    y: (r * GRID_RESOLUTION + imageValue + sinValue) / 2
  }
  return coords
}

const drawLine = function (context, frameCount, line, r) {
  var coords1 = getPointCoordinates(r, 0, frameCount)
  context.beginPath()
  context.moveTo(coords1.x, coords1.y)
  var lastPoint = coords1
  for (var c = 1; c <= line.length; c++) {
    var coords2 = getPointCoordinates(r, c, frameCount)
    context.lineTo(coords2.x, coords2.y)
    lastPoint = coords2
  };
  context.stroke()
}

const drawAllLines = function (context, frameCount) {
  forEachLine(drawLine.bind(undefined, context, frameCount))
}

// ----- Image Data -----

var imageData

const initImageData = function (canvas, context) {
  imageData = new ImagePixels('girl.png', CANVAS_SIZE / GRID_RESOLUTION / 50, function (property) {
    console.log('imageData', imageData)
  })
}

// ----- Main -----

const initCanvas = function (canvas, context) {
  context.strokeStyle = LINE_COLOR
  context.lineWidth = 1
  initLineData(canvas)
  initImageData(canvas, context)
  fillCanvas(canvas, context)
}

const updateCanvas = function (canvas, context, frameCount) {
  // updateLineData();
  fillCanvas(canvas, context)
  drawAllLines(context, frameCount)
}
