//----- Rendering and Capturing -----

var FRAME_RATE = 30;
var CANVAS_SIZE = 1080;

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

var satellites = [];
var ocanvas;

const initCanvas = function (canvas, context) {

	ocanvas = oCanvas.create({
		canvas: "#canvasElement",
		background: "#222",
		fps: FRAME_RATE,
		disableScrolling: true,
	});

	// Center planet
	var center = ocanvas.display.ellipse({
		x: ocanvas.width / 2, y: ocanvas.height / 2,
		radius: ocanvas.width / 20,
		fill: "#fff"
	}).add();

	// Prototype objects that will be used to instantiate the others
	var satelliteProto = ocanvas.display.ellipse({ fill: "#eee" });
	var pathProto = ocanvas.display.ellipse({ stroke: "1px #999" });

	// Set up data
	var depth = 3;
	var satelliteColors = ["#107B99", "#5F92C0", "#c7509f"];
	var pathColors = ["#666", "#107B99", "#5F92C0"];

	// Create seven satellites and paths. Definition is further down.
	for (var i = 0, l = 7; i < l; i++) {
		createSatellite({
			parent: center, depth: 1,
			distance: (i + 1) * ocanvas.width / 6,
			radius: ocanvas.width / 100,
			speed: 1
		});
	}

	// Definition for a satellite and its corresponding path
	function createSatellite (options) {

		// Create the path that the satellite will follow
		var path = pathProto.clone({
			radius: options.distance,
			x: options.x || 0, y: options.y || 0,
			strokeColor: pathColors[options.depth - 1]
		});
		options.parent.addChild(path);

		// Create a new satellite
		var satellite = satelliteProto.clone({
			origin: {
				x: 0,
				y: options.distance * (Math.round(Math.random()) ? 1 : -1)
			},
			speed: Math.random() * (2 * Math.random() - 0.5) + 0.5,
			radius: options.radius,
			x: options.x || 0, y: options.y || 0,
			fill: satelliteColors[options.depth - 1],
			rotation: Math.random() * 360
		});
		options.parent.addChild(satellite);
		satellites.push(satellite);

		// Create another satellite that will circle around this satellite
		if (options.depth < depth) {
			createSatellite({
				parent: satellite, depth: options.depth + 1,
				distance: options.radius * 7,
				radius: options.radius / 1.5,
				x: satellite.origin.x * -1, y: satellite.origin.y * -1,
				speed: 10
			});
		}
	}

};

const updateCanvas = function (canvas, context, frameCount) {
	for (var i = 0, l = satellites.length; i < l; i++) {
		satellites[i].rotation += satellites[i].speed;
	}
	ocanvas.draw.redraw();
};
