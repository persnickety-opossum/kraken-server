var Venue = require('./Venue');

var checkAttendees = function() {
  var currTime = new Date();
  Venue.find()
  .then(function (venues) {
    venues.forEach(function (venue) {
      if (!venue.attendees) {
        return;
      }
      var attendeeIDs = Object.keys(venue.attendees);
      attendeeIDs.forEach(function (ID) {
        var lastActive = new Date(venue.attendees[ID]);
        if (currTime - lastActive > 3600000) {
          delete venue.attendees[ID];
        }
      });
      // Only update the db if users were actually removed from the attendee list
      if (attendeeIDs.length !== Object.keys(venue.attendees).length) {
        venue.markModified('attendees');
        venue.save();
      }
    });
  });
}

module.exports.checkAttendees = checkAttendees;
