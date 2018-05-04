//----- UI helpers -----

var toggleElementDisabled = function (elementId) {
	document.getElementById(elementId).getAttribute('disabled') !== null
		? document.getElementById(elementId).removeAttribute('disabled')
		: document.getElementById(elementId).setAttribute('disabled', true);
};

var updateStatus = function () {
	frameCount++;
	document.getElementById('status').innerHTML = 'Rendering ' + frameCount + ' (' + (frameCount/FRAME_RATE + '').substring(0, 4) + ' s)';
};

//----- Rendering and Capturing -----

var FRAME_RATE = 30;
var CANVAS_SIZE = 540;

var isRendering = false;
var frameCount = 0;
var canvas;

var capturer = new CCapture({
	// WebM but GIF for Safari
	format: /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ? 'gif' : 'webm',
	framerate: FRAME_RATE,
	// verbose: true,
});

var setCanvasElement = function (elementId) {
	canvas = document.getElementById(elementId);
	canvas.width = CANVAS_SIZE * 2;
	canvas.height = CANVAS_SIZE * 2;
	canvas.style.width = CANVAS_SIZE + 'px';
	canvas.style.height = CANVAS_SIZE + 'px';
	canvas.getContext('2d').scale(2,2); // Retina screen
};

var renderNextFrame = function () {
	updateStatus();
	// Render frame
	updateCanvas(canvas, canvas.getContext('2d'), frameCount);
	if (isRendering) requestAnimationFrame(renderNextFrame);
	// Capture frame with CCapture.js
	capturer.capture(canvas);
};

var percentToPixel = function (percent) {
	return percent / 100 * CANVAS_SIZE;
};

//----- Button actions -----

var onClickStart = function () {
	isRendering = true;
	frameCount = 0;
	toggleElementDisabled('buttonPause');
	toggleElementDisabled('buttonDownload');
	setCanvasElement('canvasElement');
	initCanvas(canvas, canvas.getContext('2d'));
	capturer.start();
	renderNextFrame();
};

var onClickPause = function () {
	isRendering = !isRendering;
	if (isRendering) {
		capturer.start();
		renderNextFrame();
	}
	else {
		capturer.stop();
	}
};

var onClickDownload = function () {
	isRendering = false;
	capturer.stop();
	capturer.save();
};
