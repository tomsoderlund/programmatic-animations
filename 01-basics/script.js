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

const updateCanvas = function (canvas, context, frameCount) {
	context.strokeStyle = 'blue';
	context.lineWidth = 5;
	//context.strokeRect(20,20,150,100);
	if (!lastPosition) lastPosition = getRandomPosition(CANVAS_SIZE);
	context.moveTo(lastPosition.x, lastPosition.y);
	lastPosition = getRandomPosition(CANVAS_SIZE);
	context.lineTo(lastPosition.x, lastPosition.y);
	context.stroke();
};
