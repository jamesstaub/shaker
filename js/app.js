var shaker = new Firebase("https://shakalaka.firebaseio.com/");
var amOnline = new Firebase("https://shakalaka.firebaseio.com/.info/connected");
var colorChannels = shaker.child("colorChannels");
var nickname;


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
      if(snapshot.val()){
        $('body').css('background-color', 'rgba('+snapshot.val().alpha+','+snapshot.val().beta+','+snapshot.val().gamma+', 1.0)')
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    // $("#alpha").html();
    // $("#beta").html();
    // $("#gamma").html();
  });
}

shaker.authAnonymously(function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
    console.log("id: "+ authData.uid);
    var sessionRef;
    var userid = authData.uid
    var userRef = new Firebase("https://shakalaka.firebaseio.com/presence" + userid);

    amOnline.on('value', function(snapshot) {
      if (snapshot.val()) {
        sessionRef = userRef.push();
        sessionRef.child('ended').onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
        sessionRef.child('began').set(Firebase.ServerValue.TIMESTAMP);
        sessionRef.child('nickname').set(nickname || assumedName());
      }
    });

    // if succesfully authorized as anonymous, then create nickname field
    $("#nickname").keypress(function(e) {
        if(e.which == 13) {
          nickname = $(this).val();
          sessionRef.update({nickname: nickname});
        }
      });
  }
});

// update list of logged in users
shaker.on("value", function(snapshot) {
  if (snapshot.val()) {
    var currentUsers = [];
    for(session in snapshot.val()){
        for(user in snapshot.val()[session]){
          // if this session has a nickname propery, and it's not ended (ie. its a current session)
          if(snapshot.val()[session][user].nickname && !snapshot.val()[session][user].ended){
            currentUsers.push(snapshot.val()[session][user].nickname);
          }
        }
    }
    $("#sessions").html(
      currentUsers.map(function(e){
        return "<li>"+e+"</li>";
      })
    )
  }
});


function assumedName(){
  var names = ['anonymous alice', 'secret sam', 'random randy', 'tricky tina', 'careful carrie', 'mystery mark']
  var rand = Math.random() * names.length;
  return names[Math.floor(rand)]
}


