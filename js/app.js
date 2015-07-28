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
    // get the standard deviation of each gyroscope metric
    var alpha = delta(o.alpha, valueStream.alpha, 10);
    var beta = delta(o.beta, valueStream.beta, 10);
    var gamma = delta(o.gamma, valueStream.gamma, 10);

    // normalize gyro values between -10 and 10 to 0 to 256 range
    alpha = scale(alpha, -10, 10, 0, 256);
    beta = scale(beta, -10, 10, 0, 256);
    gamma = scale(gamma, -10, 10, 0, 256);
    $('body').css('background-color', 'rgba('+alpha+','+beta+','+gamma+', 1.0)')
    // $("#alpha").html();
    // $("#beta").html();
    // $("#gamma").html();
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

function scale(input, inputMin, inputMax, outputMin, outputMax){
   input = (input - inputMin) / (inputMax - inputMin);
   output = input * (outputMax - outputMin) + outputMin;
   return Math.floor(output);
}
