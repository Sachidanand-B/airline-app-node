var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://airline-checkin-24383.firebaseio.com",
});

var db = admin.database();
var airlineRef = db.ref("airlinelist");
var userRef = db.ref("users");
var passengerRef = db.ref("passengers");

exports.getAirLineData = (req, res, next) => {
  airlineRef.once("value", function (snapshot) {
    res.send(snapshot.val());
    next();
  });
};

exports.getPassengersData = (req, res, next) => {
  console.log("req", req);
  passengerRef
    .orderByChild("flightId")
    .equalTo(req.params.id)
    .once("value", function (snapshot) {
      if (snapshot.exists()) {
        console.log('>>>>', snapshot.val());
        res.send(snapshot.val());
        next();
      } else {
        res.status(500);
        next();
      }
    });
};

exports.postUserData = (req, res, next) => {
  const email = req.body.email;
  userRef
    .orderByChild("email")
    .equalTo(email)
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        res.send(snapshot.val());
        next();
      } else {
        const user = {
          email: req.body.email,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          role: "user",
        };
        userRef.push(user);
        res.send({ created: user });
        next();
      }
    });
};

exports.postCheckedInData = (req, res, next) => {
  // passengerRef
  //   // .orderByChild("flightId")
  //   // .equalTo("1A")
  //   .once("value", function (snapshot) {
  //     if (snapshot.exists()) {
  //             console.log(snapshot.val());

  //       // snapshot.ref.child(Object.keys(snapshot.val())[0]).update({
  //       //   flightId_passport:
  //       //     Object.values(snapshot.val())[0].flightId +
  //       //     "_" +
  //       //     Object.values(snapshot.val())[0].passport,
  //       // });
  //     }
  //   });
  passengerRef
    .orderByChild("flightId_passport")
    .equalTo(req.body.flightId + "_" + req.body.passport)
    .once("value", function (snapshot) {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        snapshot.ref
          .child(Object.keys(snapshot.val())[0])
          .update({ checkedIn: req.body.checkedIn });
      }
      res.send({message: "success"});
      next();
    });
};
