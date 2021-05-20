// ----- Drawing on Canvas -----

// From https://github.com/liabru/matter-js/wiki/Getting-started

var BOX_SIZE = percentToPixel(25)

// module aliases
var Engine = Matter.Engine
var Render = Matter.Render
var World = Matter.World
var Composite = Matter.Composite
var Bodies = Matter.Bodies

// create an engine
var engine = Engine.create()

// create two boxes and a ground
var boxA = Bodies.rectangle(CANVAS_SIZE / 2, -CANVAS_SIZE / 2 - BOX_SIZE / 2, BOX_SIZE, BOX_SIZE)
boxA.color = 'dodgerblue'
var boxB = Bodies.rectangle(CANVAS_SIZE / 2 + BOX_SIZE * 2 / 3, -CANVAS_SIZE / 2 - BOX_SIZE * 2, BOX_SIZE, BOX_SIZE)
boxB.color = 'tomato'
var ground = Bodies.rectangle(CANVAS_SIZE / 2, CANVAS_SIZE - (100 / 2), CANVAS_SIZE - 100, 100, { isStatic: true })

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground])

// run the engine
Engine.run(engine)

// create a renderer
// var render = Render.create({
//  element: document.body,
//  engine: engine
// });

// run the renderer
// Render.run(render);

const fillCanvas = function (canvas, context, color = 'white') {
  context.fillStyle = color
  context.fillRect(0, 0, canvas.width, canvas.height)
}

const fillCanvasGradient = function (canvas, context, colorInner = 'red', colorOuter = 'blue') {
  var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 10, canvas.width / 2, canvas.height / 2, canvas.width / 2 * 1.414) // x0,y0,r0,x1,y1,r1
  gradient.addColorStop(0, colorInner)
  gradient.addColorStop(1, colorOuter)
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)
}

// From https://stackoverflow.com/questions/18838202/fill-polygon-on-canvas/18838472#18838472
const drawPolygon = function (context, body) {
  context.beginPath()
  // context.strokeStyle = body.color || 'silver';
  context.fillStyle = body.color || 'silver'
  context.lineWidth = 10
  context.lineCap = 'round'
  for (var i = 0; i < body.vertices.length; i++) {
    context.lineTo(body.vertices[i].x, body.vertices[i].y)
  }
  context.lineTo(body.vertices[0].x, body.vertices[0].y)
  context.closePath()
  context.fill()
  // context.stroke();
}

const initCanvas = function (canvas, context) {
  fillCanvas(canvas, context)
}

const updateCanvas = function (canvas, context, frameCount) {
  fillCanvasGradient(canvas, context, '#ccc', '#444')
  var bodies = Composite.allBodies(engine.world)
  for (var i = 0; i < bodies.length; i += 1) {
    drawPolygon(context, bodies[i])
  };
}
