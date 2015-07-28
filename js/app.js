var shaker = new Firebase("https://shakalaka.firebaseio.com/");

var valueStream = {
  alpha: [],
  beta: [],
  gamma: []
}



$(window).load(function() {
  // listen for device gyroscope
  pollGyroscope(30);
});


function pollGyroscope(rate) {
  // set gyroscope update frequency
  gyro.frequency = rate;
  gyro.startTracking(function(o) {
    $("#alpha").html(delta(o.alpha, valueStream.alpha, 10));
    $("#beta").html(delta(o.beta, valueStream.beta, 10));
    $("#gamma").html(delta(o.gamma, valueStream.gamma, 10));
  });


}

// collect stream of values into array of some length then get the std dev
function delta(value, array, length){
  array.unshift(value);
  if(array.length > length){
    array.pop();
  }
  return standardDeviation(array);
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
