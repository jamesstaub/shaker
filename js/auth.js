var amOnline = new Firebase("https://shakalaka.firebaseio.com/.info/connected");



shaker.authAnonymously(function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
    console.log("id: "+ authData.uid);

    var userid = authData.uid
    var userRef = new Firebase("https://shakalaka.firebaseio.com/presence" + userid);

    amOnline.on('value', function(snapshot) {
      if (snapshot.val()) {
        var sessionRef = userRef.push();
        sessionRef.child('ended').onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
        sessionRef.child('began').set(Firebase.ServerValue.TIMESTAMP);
      }
    });
  }
});



