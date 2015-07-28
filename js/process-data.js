// arrays to contain streams of gyroscope data
var valueStream = {
  alpha: [],
  beta: [],
  gamma: []
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
