var shaker = new Firebase("https://shakalaka.firebaseio.com/");

$(window).load(function() {
  // listen for device gyroscope
  pollGyro(50);
});


function pollGyro(rate) {
  // setting gyroscope update frequency
  gyro.frequency = rate;
  gyro.startTracking(function(o) {

    $("#alpha").html( o.alpha);
    $("#beta").html( o.beta);
    $("#gamma").html( o.gamma);
    return [o.alpha, o.beta, o.gamma]

  });
}


function standardDeviation(values){
  var avg = average(values);

  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}
