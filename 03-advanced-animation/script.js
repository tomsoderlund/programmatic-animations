//----- Drawing on Canvas -----

// Adapted from http://ocanvas.org/demos/4

var CAR_SPEED = 5;

var ocanvas;
var invisibleLineCar1, invisibleLineCar2;

const initCanvas = function (canvas, context) {

	ocanvas = oCanvas.create({
		canvas: '#canvasElement',
		background: '#84B317',
		fps: FRAME_RATE,
		disableScrolling: true,
	});

	var radius = 25;
	var distance = 32;

	// Track
	ocanvas.display.register(
		'track',
		{ shapeType: 'radial' },
		function (ocanvas) {
			// Asphalt
			ocanvas.strokeStyle = '#858480';
			ocanvas.lineWidth = percentToPixel(10);
			ocanvas.beginPath();
			ocanvas.arc(this.abs_x, this.abs_y, this.radius_x, 0, 2 * Math.PI);
			ocanvas.stroke();
			// Center line
			ocanvas.strokeStyle = '#B8B7B4';
			ocanvas.lineWidth = percentToPixel(0.5);
			ocanvas.setLineDash([percentToPixel(3), percentToPixel(1)]);
			ocanvas.beginPath();
			ocanvas.arc(this.abs_x, this.abs_y, this.radius_x, 0, 2 * Math.PI);
			ocanvas.stroke();
		}
	);
	ocanvas.addChild(ocanvas.display.track({
		x: percentToPixel(distance),
		y: percentToPixel(distance),
		radius_x: percentToPixel(radius),
	}));
	ocanvas.addChild(ocanvas.display.track({
		x: percentToPixel(100 - distance),
		y: percentToPixel(100 - distance),
		radius_x: percentToPixel(radius),
	}));

	// Car 1: line that car will follow
	invisibleLineCar1 = ocanvas.display.ellipse({
		x: percentToPixel(distance),
		y: percentToPixel(distance),
		radius_x: percentToPixel(radius),
		radius_y: percentToPixel(radius),
	});
	ocanvas.addChild(invisibleLineCar1);
	// Car 1: car sprite
	var car1 = ocanvas.display.image({
		x: 0,
		y: percentToPixel(-distance + 7),
		origin: { x: 'center', y: 'center' },
		image: 'car_red.png'
	});
	car1.scale(0.2);
	invisibleLineCar1.addChild(car1);

	// Car 2: line that car will follow
	invisibleLineCar2 = ocanvas.display.ellipse({
		x: percentToPixel(100 - distance),
		y: percentToPixel(100 - distance),
		radius_x: percentToPixel(radius),
		radius_y: percentToPixel(radius),
	});
	ocanvas.addChild(invisibleLineCar2);
	// Car 2: car sprite
	var car2 = ocanvas.display.image({
		x: 0,
		y: percentToPixel(-distance + 7),
		origin: { x: 'center', y: 'center' },
		image: 'car_yellow.png'
	});
	car2.scale(0.2);
	invisibleLineCar2.addChild(car2);
	invisibleLineCar2.rotateTo(100);

};

const updateCanvas = function (canvas, context, frameCount) {
	invisibleLineCar1.rotation += CAR_SPEED;
	invisibleLineCar2.rotation += CAR_SPEED;
	ocanvas.draw.redraw();
};
