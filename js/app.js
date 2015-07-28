var shaker = new Firebase("https://shakalaka.firebaseio.com/");
var colorChannels = shaker.child("colorChannels");


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

    // send values to firebase
    colorChannels.set({
      alpha: alpha,
      beta: beta,
      gamma: gamma
    })

    colorChannels.on("value", function(snapshot) {
      //
      $('body').css('background-color', 'rgba('+snapshot.val().alpha+','+snapshot.val().beta+','+snapshot.val().gamma+', 1.0)')
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    // $("#alpha").html();
    // $("#beta").html();
    // $("#gamma").html();
  });
}
