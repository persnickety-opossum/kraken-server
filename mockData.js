var mongoose = require('mongoose');
var Comment = require('./db/Comment');
var User = require('./db/User');
var Venue = require('./db/Venue');

if (!process.env.production) var config = require('./config');

var dbURI = process.env.DB_URI || config.dbURI
mongoose.connect(dbURI);

Venue.find().remove().exec();
User.find().remove().exec();
Comment.find().remove().exec();

// var user1 = new User({
//   token: 'lol',
//   coordinates: '37.783699,-122.409023'
// });
// user1.save();

// var user2 = new User({
//   token: 'wat',
//   coordinates: '37.781175,-122.406243'
// });
// user2.save();

// var hackreactor = new Venue({
//   title: 'Hack Reactor',
//   attendees: {},
//   ratings: {},
//   description: 'The CS degree for the 21st century',
//   address: '944 Market St. #8, San Francisco, CA',
//   latitude: 37.783585,
//   longitude: -122.408955,
//   creator: user1.id,
//   datetime: new Date().toISOString()
// });
// hackreactor.ratings[user1.id] = 10;
// hackreactor.ratings[user2.id] = 8;
// hackreactor.save();

// var tempest = new Venue({
//   title: 'Tempest',
//   attendees: {},
//   ratings: {},
//   description: 'No-frills watering hole',
//   address: '431 Natoma St., San Francisco, CA',
//   latitude: 37.7811679,
//   longitude: -122.4062895,
//   creator: user2.id,
//   datetime: new Date().toISOString()
// });
// tempest.ratings[user1.id] = 5;
// tempest.ratings[user2.id] = 9;
// tempest.save();

// var comment1 = new Comment({
//   creator: user1.id,
//   content: "Allen's hair is amazing.",
//   venue: hackreactor.id,
//   datetime: new Date().toISOString(),
//   atVenue: true,
//   votes: 1337
// });
// comment1.save();

// var comment2 = new Comment({
//   creator: user2.id,
//   content: 'OMG pictures?',
//   venue: hackreactor.id,
//   datetime: new Date().toISOString(),
//   atVenue: false,
//   votes: 0
// });
// comment2.save();

// var comment3 = new Comment({
//   creator: user1.id,
//   content: 'JavaScript!',
//   venue: hackreactor.id,
//   datetime: new Date().toISOString(),
//   atVenue: true,
//   votes: 1
// });
// comment3.save();

// var comment4 = new Comment({
//   creator: user2.id,
//   content: 'Very chill',
//   venue: tempest.id,
//   datetime: new Date().toISOString(),
//   atVenue: true,
//   votes: 1
// });
// comment4.save();

// var comment5 = new Comment({
//   creator: user1.id,
//   content: 'arglebargle',
//   venue: tempest.id,
//   datetime: new Date().toISOString(),
//   atVenue: false,
//   votes: -1
// });
// comment5.save();

// var comment6 = new Comment({
//   creator: user2.id,
//   content: 'O_O;',
//   venue: tempest.id,
//   datetime: new Date().toISOString(),
//   atVenue: true,
//   votes: 2
// });
// comment6.save();

// hackreactor.comments = [comment1.id, comment2.id, comment3.id];
// hackreactor.attendees[user1.id] = comment3.datetime;
// hackreactor.attendees[user2.id] = comment2.datetime;
// hackreactor.save();
// tempest.comments = [comment4.id, comment5.id, comment6.id];
// hackreactor.attendees[user1.id] = comment3.datetime;
// hackreactor.attendees[user2.id] = comment3.datetime;
// tempest.save();

mongoose.connection.close();
