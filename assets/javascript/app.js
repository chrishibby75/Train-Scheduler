var config = {
    apiKey: "AIzaSyBSXtXc7JOaS1l8T_Zt_1FX-BJckOg2cZk",
    authDomain: "train-scheduler-75437.firebaseapp.com",
    databaseURL: "https://train-scheduler-75437.firebaseio.com",
    projectId: "train-scheduler-75437",
    storageBucket: "",
    messagingSenderId: "349555261682"
};
firebase.initializeApp(config);

var database = firebase.database();

var name;
var destination;
var firstTrain;
var frequency = 0;

$("#add-train").on("click", function () {
    event.preventDefault();
    //storing and retreiving new train data
    name = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

    //pushing to database
    database.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    $("#form")[0].reset();
});

database.ref().on("child_added", function (childSnapshot) {
    var nextArr;
    var minAway;
    //change year so first train comes before now
    var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");

    //difference between the current and first train
    var diffTime = moment().diff(moment(firstTrainNew), "minutes");
    var remainder = diffTime % childSnapshot.val().frequency;

    //minutes until next train
    var minAway = childSnapshot.val().frequency - remainder;

    //next train time
    var nextTrain = moment().add(minAway, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");

    $("#add-row").append("<tr><td>" + childSnapshot.val().name +
        "</td><td>" + childSnapshot.val().destination +
        "</td><td>" + childSnapshot.val().frequencty +
        "</td><td>" + nextTrain +
        "</td><td>" + minAway + "</td></tr>");
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);

});

database.ref().orderByChild("dateAdded").limitToLast(1).on("childAdded", function(snaphot) {
    //change html to reflect
    $("#name-display").html(snapshot.val().name);
    $("#email-display").html(snapshot.val().email);
    $("#age-display").html(snapshot.val().age);
    $("#comment-display").html(snapshot.val().comment);
});

