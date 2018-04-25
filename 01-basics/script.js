//----- Rendering and Capturing -----

var FRAME_RATE = 10;

var isRendering = false;
var frameCount = 0;

var capturer = new CCapture({
	format: 'webm',
	framerate: FRAME_RATE,
	// verbose: true,
});

var start = function () {
	isRendering = true;
	frameCount = 0;
	var canvas = document.getElementById('canvasElement');
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

function render () {
	frameCount++;
	document.getElementById('status').innerHTML = 'Rendering ' + frameCount + ' (' + (frameCount/FRAME_RATE + '').substring(0, 4) + ' s)';
	if (isRendering) requestAnimationFrame(render);
	// rendering stuff ...
	var canvas = document.getElementById('canvasElement');
	updateCanvas(canvas, canvas.getContext('2d'));
	capturer.capture(canvas);
}

//----- Drawing on Canvas -----

const getRandomPosition = (maxValue) => ({
	x: Math.floor(Math.random() * maxValue),
	y: Math.floor(Math.random() * maxValue),
});

let lastPosition;

const initCanvas = function (canvas, context) {
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);
}

const updateCanvas = function (canvas, context) {
	context.strokeStyle = 'blue';
	context.lineWidth = 5;
	//context.strokeRect(20,20,150,100);
	if (!lastPosition) lastPosition = getRandomPosition(canvas.width);
	context.moveTo(lastPosition.x, lastPosition.y);
	lastPosition = getRandomPosition(canvas.width);
	context.lineTo(lastPosition.x, lastPosition.y);
	context.stroke();
};
