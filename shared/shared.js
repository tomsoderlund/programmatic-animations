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

//----- Button actions -----

var onClickStart = function () {
	isRendering = true;
	frameCount = 0;
	toggleElementDisabled('buttonPause');
	toggleElementDisabled('buttonDownload');
	canvas = document.getElementById('canvasElement');
	initCanvas(canvas, canvas.getContext('2d'));
	capturer.start();
	render();
};

var onClickPause = function () {
	isRendering = !isRendering;
	if (isRendering) {
		capturer.start();
		render();
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