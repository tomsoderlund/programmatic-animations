//----- City data model -----

var CAR_SPEED = 5;

var allObjects = [];

const COLORS = {
	background: '#150529',
	streetBackground: '#601331',
	streetLines: 'rgba(255,255,255, 0.33)',
	carFill: '#c2907d',
	carWindows: '#55073e',
	carFrontLights: 'rgba(255,255,255, 0.5)',
	carBackLights: '#e43c66',
}

const STREET_GRID_COLUMNS = 3;
const GUTTER_OUTER = 8;
const GUTTER = (100-GUTTER_OUTER*2) / (STREET_GRID_COLUMNS-1);
const STREET_GRID = [];

const initStreetGrid = function (property) {
	// Set up points
	for (var x = 0; x < STREET_GRID_COLUMNS; x++) {
		for (var y = 0; y < STREET_GRID_COLUMNS; y++) {
			STREET_GRID.push({ x: GUTTER_OUTER+x*GUTTER, y: GUTTER_OUTER+y*GUTTER, connections: [] });
		};
	};
	// Set up connections/intersections
	for (var p1 = 0; p1 < STREET_GRID.length; p1++) {
		STREET_GRID[p1].connections = [];
		for (var p2 = 0; p2 < STREET_GRID.length; p2++) {
			const w = Math.abs(STREET_GRID[p2].x - STREET_GRID[p1].x);
			const h = Math.abs(STREET_GRID[p2].y - STREET_GRID[p1].y);
			const distance = Math.sqrt(w*w + h*h);
			//console.log(`connect: ${p1}->${p2}`, {GUTTER, distance, OK: distance <= (GUTTER+1)});
			if (p2 !== p1 && distance <= (GUTTER+1)) {
				STREET_GRID[p1].connections.push(p2);
			}
		};
	};
	//console.log(`STREET_GRID:`, STREET_GRID);
};

initStreetGrid();


//----- Drawing on oCanvas -----

var ocanvas;

const initCanvas = function (canvas, context) {

	ocanvas = oCanvas.create({
		canvas: '#canvasElement',
		background: COLORS.background,
		fps: FRAME_RATE,
		disableScrolling: true,
	});

	// Street
	ocanvas.display.register(
		'street',
		{ shapeType: 'rectangular' },
		function (ctx) {
			// Asphalt
			ctx.strokeStyle = COLORS.streetBackground;
			ctx.lineWidth = percentToPixel(10);
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(this.x1, this.y1);
			ctx.lineTo(this.x2, this.y2);
			ctx.stroke();
			// Center line
			ctx.strokeStyle = COLORS.streetLines;
			ctx.lineWidth = percentToPixel(0.3);
			ctx.setLineDash([percentToPixel(2), percentToPixel(2)]);
			ctx.beginPath();
			ctx.moveTo(this.x1, this.y1);
			ctx.lineTo(this.x2, this.y2);
			ctx.stroke();
		}
	);
	// Draw street grid
	for (var p1 = 0; p1 < STREET_GRID.length; p1++) {
		for (var p1c = 0; p1c < STREET_GRID[p1].connections.length; p1c++) {
			const p2 = STREET_GRID[p1].connections[p1c];
			//console.log(`line: ${p1}->${p2}`, [STREET_GRID[p1].x, STREET_GRID[p1].y], [STREET_GRID[p2].x, STREET_GRID[p2].y]);
			ocanvas.addChild(ocanvas.display.street({
				x1: percentToPixel(STREET_GRID[p1].x),
				y1: percentToPixel(STREET_GRID[p1].y),
				x2: percentToPixel(STREET_GRID[p2].x),
				y2: percentToPixel(STREET_GRID[p2].y),
			}));
		};
	};

	const xySpeed = (speed, rotationDegrees) => ({
		x: Math.sin(rotationDegrees/180 * Math.PI) * speed,
		y: -Math.cos(rotationDegrees/180 * Math.PI) * speed,
	});

	// Car
	ocanvas.display.register(
		'car',
		{
			shapeType: 'radial',
			steerTo: function (degrees) {
				console.log(`steerTo:`, degrees);
				this.desiredRotation = degrees;
			},
			turningSpeed: 2,
			updateRotation: function () {
				if (this.desiredRotation && this.desiredRotation !== this.rotation) {
					this.rotate((this.desiredRotation > this.rotation ? 1 : -1) * this.turningSpeed);
				}
			},
			update: function () {
				//console.log(`thisCar:`, speed, this);
				this.updateRotation();
				const speed = xySpeed(this.speed, this.rotation);
				this.x += speed.x;
				this.y += speed.y;
			},
		},
		// Draw car
		function (ctx) {
			const size = { w: 15, h: 22 };
			ctx.fillStyle = COLORS.carFill;
			ctx.fillRect(-size.w/2,-size.h/2, size.w,size.h);
			// Windows
			ctx.fillStyle = COLORS.carWindows;
			ctx.fillRect(1-size.w/2,-size.h/2+5, size.w-2,4);
			ctx.fillRect(1-size.w/2,size.h/2-7, size.w-2,3);
			// Lights: front
			ctx.fillStyle = COLORS.carFrontLights;
			ctx.fillRect(-size.w/2,-size.h/2, 5,2);
			ctx.fillRect(size.w/2-5,-size.h/2, 5,2);
			// Lights: back
			ctx.fillStyle = COLORS.carBackLights;
			ctx.fillRect(-size.w/2,size.h/2-2, 5,2);
			ctx.fillRect(size.w/2-5,size.h/2-2, 5,2);
		}
	);

	// Add cars
	const CAR_COUNT = 1;
	const STEERING_DIRECTIONS = [0, 90, 180, -90];

	for (var i = 0; i < CAR_COUNT; i++) {

		const startPoint = getRandomFromArray(STREET_GRID);

		const car = ocanvas.display.car({
			x: percentToPixel(i===0 ? 52.5 : startPoint.x + 2.5),
			y: percentToPixel(i===0 ? 70.0 : startPoint.y + 2.5),
			speed: 1.00,
			rotation: i===0 ? 0 : getRandomFromArray(STEERING_DIRECTIONS),
		});

		ocanvas.addChild(car);
		allObjects.push(car);

		setInterval(function () { 
			car.steerTo(getRandomFromArray(STEERING_DIRECTIONS));
		},
		3000);
	};

};

const updateCanvas = function (canvas, context, frameCount) {
	for (var i in allObjects) {
		allObjects[i].update();
	}
	ocanvas.draw.redraw();
};
