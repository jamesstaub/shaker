gyro.startTracking(function(o) {
  console.log("X: " + o.x);
  console.log("Y: " + o.y)
    // o.x, o.y, o.z for accelerometer
    // o.alpha, o.beta, o.gamma for gyro
});
