  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBptum861lnbqHxO30_MTs0XaDJTN2CKqQ",
    authDomain: "train-schedule-5217f.firebaseapp.com",
    databaseURL: "https://train-schedule-5217f.firebaseio.com",
    projectId: "train-schedule-5217f",
    storageBucket: "train-schedule-5217f.appspot.com",
    messagingSenderId: "256843944363"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var name = "";
  var destination = "";
  var start = "";
  var frequency = "";
  var n = 1;
  var keys = "";

  $("#add-train").on("click", function(event) {
    event.preventDefault();

    name = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    start = $("#start-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    database.ref().push({
      name: name,
      destination: destination,
      start: start,
      frequency: frequency,
    });

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
  });

  database.ref().on("child_added", function(childSnapshot) {
    database.ref().on("value", function(snapshot) {
      var sv = snapshot.val();
      console.log(snapshot.val());
      keys = Object.keys(sv);
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
    var key = keys[n];

    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    var trainFreq = childSnapshot.val().frequency;

    var convertedStart = moment(trainStart, "hh:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(convertedStart), "minutes");
    var remainder = diffTime % trainFreq;
    var timeToNext = trainFreq - remainder;
    var nextTime = moment().add(timeToNext, "minutes");
    var nextTimeFormatted = moment(nextTime).format("hh:mm A");

    $("#train-table").append(`
      <tr class="trainData" data-value="${n}">
      <th>${n}</th>
      <td>${childSnapshot.val().name}</td>
      <td>${childSnapshot.val().destination}</td>
      <td>${childSnapshot.val().frequency}</td>
      <td>${nextTimeFormatted}</td>
      <td>${timeToNext}</td>
      <td><input type='button' value='X' data-key='${key}' class='removeData btn btn-danger btn-circle btn-xs'></td>
      </tr>
      `);
    n++;
  }, function(errorObject){
    console.log("Errors handled: " + errorObject.code)
  });

  //not working
  $("#train-table").on("click", ".removeData", function() {
    $(this).closest("tr").remove();
    key = $(this).attr("data-key");
    database.ref().child(key).remove();
  });