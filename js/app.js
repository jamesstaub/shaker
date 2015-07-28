var shaker = new Firebase("https://shakalaka.firebaseio.com/");

$(window).load(function() {

  function startPoll() {
    // initializing physics system


    // setting gyroscope update frequency
    gyro.frequency = 10;
    gyro.startTracking(function(o) {
      // updating player velocity
      // player.body.velocity.x += o.gamma/20;
      // player.body.velocity.y += o.beta/20;
      $("#alpha").html("alpha" + o.alpha);
      $("#beta").html("beta" + o.beta);
      $("#gamma").html("gamma" + o.gamma);
    });

  }
  startPoll();

});





window.onload = function() {



}
