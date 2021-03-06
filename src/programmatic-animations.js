const FRAME_RATE = 30
const CANVAS_SIZE = 540

// ----- UI helpers -----

const toggleElementDisabled = function (elementId) {
  document.getElementById(elementId).getAttribute('disabled') !== null
    ? document.getElementById(elementId).removeAttribute('disabled')
    : document.getElementById(elementId).setAttribute('disabled', true)
}

const updateStatus = function () {
  frameCount++
  document.getElementById('status').innerHTML = 'Rendering ' + frameCount + ' (' + (frameCount / FRAME_RATE + '').substring(0, 4) + ' s)'
}

// ----- Rendering and Capturing -----

let isRendering = false
let frameCount = 0
let canvas

const capturer = new CCapture({
  // WebM but GIF for Safari
  format: /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ? 'gif' : 'webm',
  framerate: FRAME_RATE
  // verbose: true,
})

const setCanvasElement = function (elementId) {
  canvas = document.getElementById(elementId)
  canvas.width = CANVAS_SIZE * 2
  canvas.height = CANVAS_SIZE * 2
  canvas.style.width = CANVAS_SIZE + 'px'
  canvas.style.height = CANVAS_SIZE + 'px'
  canvas.getContext('2d').scale(2, 2) // Retina screen
}

const renderNextFrame = function () {
  updateStatus()
  // Render frame
  updateCanvas(canvas, canvas.getContext('2d'), frameCount)
  if (isRendering) requestAnimationFrame(renderNextFrame)
  // Capture frame with CCapture.js
  capturer.capture(canvas)
}

const percentToPixel = function (percent) {
  return percent / 100 * CANVAS_SIZE
}

const getRandomValue = function (minValue, maxValue) {
  return minValue + Math.random() * (maxValue - minValue)
}

const getRandomFromArray = function (array) {
  return array[Math.floor(Math.random() * array.length)]
}

// ----- Image Data -----

const ImagePixels = function (imageUrl, scaleFactor = 1.0, cb) {
  const MAX_PIXELS = 500
  const imagePixelObject = this
  const tempImg = new Image()
  tempImg.src = imageUrl
  tempImg.onload = function () {
    const context = document.createElement('canvas').getContext('2d')
    imagePixelObject.imageUrl = imageUrl
    imagePixelObject.width = Math.min(Math.round(tempImg.naturalWidth * scaleFactor), MAX_PIXELS)
    imagePixelObject.height = Math.min(Math.round(tempImg.naturalHeight * scaleFactor), MAX_PIXELS)
    context.drawImage(tempImg, 0, 0, imagePixelObject.width, imagePixelObject.height)
    imagePixelObject.pixels = context.getImageData(0, 0, imagePixelObject.width, imagePixelObject.height).data
    if (cb) cb()
  }
}
ImagePixels.prototype.getPixels = function () {
  return this.pixels
}
ImagePixels.prototype.getPixel = function (x, y) {
  const pixelIndex = y * this.width * 4 + x * 4
  const pixelValues = this.pixels ? this.pixels.slice(pixelIndex, pixelIndex + 4) : []
  return {
    r: pixelValues[0],
    g: pixelValues[1],
    b: pixelValues[2],
    a: pixelValues[3]
  }
}

// ----- Button actions -----

const onClickStart = function () {
  isRendering = true
  frameCount = 0
  toggleElementDisabled('buttonPause')
  toggleElementDisabled('buttonDownload')
  setCanvasElement('canvasElement')
  initCanvas(canvas, canvas.getContext('2d'))
  capturer.start()
  renderNextFrame()
}

const onClickPause = function () {
  isRendering = !isRendering
  if (isRendering) {
    capturer.start()
    renderNextFrame()
  } else {
    capturer.stop()
  }
}

const onClickDownload = function () {
  isRendering = false
  capturer.stop()
  capturer.save()
}
