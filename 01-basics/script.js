//----- Coordinates -----

const getRandomPosition = (maxValue) => ({
	x: Math.floor(Math.random() * maxValue),
	y: Math.floor(Math.random() * maxValue),
});

//----- Main -----

let lastPosition;

const initCanvas = function (canvas, context) {
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);
}

const updateCanvas = function (canvas, context, frameCount) {
	context.strokeStyle = 'deeppink';
	context.lineWidth = 5;
	if (!lastPosition) lastPosition = getRandomPosition(CANVAS_SIZE);
	context.beginPath();
	context.moveTo(lastPosition.x, lastPosition.y);
	lastPosition = getRandomPosition(CANVAS_SIZE);
	context.lineTo(lastPosition.x, lastPosition.y);
	context.stroke();
};
