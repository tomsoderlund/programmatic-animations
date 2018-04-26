//----- Rendering and Capturing -----

var FRAME_RATE = 25;
var CANVAS_SIZE = 1080;
var BOX_SIZE = 300;

var isRendering = false;
var frameCount = 0;
var canvas;

var capturer = new CCapture({
	format: 'webm',
	framerate: FRAME_RATE,
	// verbose: true,
});

var start = function () {
	isRendering = true;
	frameCount = 0;
	document.getElementById('buttonPause').removeAttribute('disabled');
	document.getElementById('buttonDownload').removeAttribute('disabled');
	canvas = document.getElementById('canvasElement');
	initCanvas(canvas, canvas.getContext('2d'));
	capturer.start();
	render();
};

var pause = function () {
	isRendering = !isRendering;
	if (isRendering) {
		capturer.start();
		render();
	}
	else {
		capturer.stop();
	}
};

var stopAndDownload = function () {
	isRendering = false;
	capturer.stop();
	capturer.save();
};

const updateStatus = function () {
	frameCount++;
	document.getElementById('status').innerHTML = 'Rendering ' + frameCount + ' (' + (frameCount/FRAME_RATE + '').substring(0, 4) + ' s)';
};

function render () {
	updateStatus();
	// Render frame
	updateCanvas(canvas, canvas.getContext('2d'), frameCount);
	if (isRendering) requestAnimationFrame(render);
	// Capture frame with CCapture.js
	capturer.capture(canvas);
}

//----- Drawing on Canvas -----

// From https://github.com/liabru/matter-js/wiki/Getting-started

// module aliases
var Engine = Matter.Engine,
	Render = Matter.Render,
	World = Matter.World,
	Composite = Matter.Composite,
	Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();

// create two boxes and a ground
var boxA = Bodies.rectangle(CANVAS_SIZE/2,-CANVAS_SIZE/2 - BOX_SIZE/2, BOX_SIZE,BOX_SIZE);
boxA.color = 'darkslategray';
var boxB = Bodies.rectangle(CANVAS_SIZE/2 + BOX_SIZE*2/3,-CANVAS_SIZE/2 - BOX_SIZE*2, BOX_SIZE,BOX_SIZE);
boxB.color = 'tomato';
var ground = Bodies.rectangle(CANVAS_SIZE/2,CANVAS_SIZE-(100/2), CANVAS_SIZE-100,100, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground]);

// run the engine
Engine.run(engine);

// create a renderer
// var render = Render.create({
// 	element: document.body,
// 	engine: engine
// });

// run the renderer
//Render.run(render);

const initCanvas = function (canvas, context) {
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);
};

const clearCanvas = function (canvas, context, color = 'white') {
	context.fillStyle = color;
	context.fillRect(0, 0, canvas.width, canvas.height);
};

const drawPolygon = function (context, body) {
	context.beginPath();
	context.moveTo(body.vertices[0].x, body.vertices[0].y);
	for (var j = 1; j < body.vertices.length; j += 1) {
		context.lineTo(body.vertices[j].x, body.vertices[j].y);
	};
	context.lineTo(body.vertices[0].x, body.vertices[0].y);
	context.lineWidth = 10;
	context.strokeStyle = body.color || 'gray';
	context.stroke();
};

const updateCanvas = function (canvas, context, frameCount) {
	clearCanvas(canvas, context);
	// From https://github.com/liabru/matter-js/wiki/Rendering
	var bodies = Composite.allBodies(engine.world);
	for (var i = 0; i < bodies.length; i += 1) {
		drawPolygon(context, bodies[i]);
	};
};
