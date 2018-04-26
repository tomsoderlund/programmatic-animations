//----- Rendering and Capturing -----

var FRAME_RATE = 10;

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
var boxA = Bodies.rectangle(400, 0, 80, 80);
var boxB = Bodies.rectangle(450, 0, 80, 80);
var ground = Bodies.rectangle(400, 800, 810, 60, { isStatic: true });

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
}

const updateCanvas = function (canvas, context, frameCount) {
	// From https://github.com/liabru/matter-js/wiki/Rendering
	var bodies = Composite.allBodies(engine.world);

	context.fillStyle = '#fff';
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.beginPath();

	for (var i = 0; i < bodies.length; i += 1) {
		var vertices = bodies[i].vertices;

		context.moveTo(vertices[0].x, vertices[0].y);

		for (var j = 1; j < vertices.length; j += 1) {
			context.lineTo(vertices[j].x, vertices[j].y);
		}

		context.lineTo(vertices[0].x, vertices[0].y);
	}

	context.lineWidth = 1;
	context.strokeStyle = '#999';
	context.stroke();
};
