var FRAME_RATE = 30;

var capturer = new CCapture({
  format: /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ? 'gif' : 'webm',
  framerate: FRAME_RATE
});

function setup() {
  createCanvas(540, 540);
  frameRate(FRAME_RATE);
}

var startMillis;

var x = 0;

function draw() {
  if (frameCount === 1) {
    // start the recording on the first frame
    // avoids the code freeze which occurs if capturer.start is called in the setup, since v0.9 of p5.js
    capturer.start();
  }

  if (startMillis == null) {
    startMillis = millis();
  }
  var duration = 3000;
  
  var elapsed = millis() - startMillis;
  var t = map(elapsed, 0, duration, 0, 1);

  if (t > 1) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }
  
  // ACTUAL DRAW FUNCTIONS HERE:
  background(220);
  ellipse(50 + x, 50 + x, 80, 80);
  x = x + 5;

  console.log('capturing frame');
  capturer.capture(document.getElementById('defaultCanvas0'));
}
