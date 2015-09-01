var mongoose = require('mongoose');
var Comment = require('./db/Comment');
var User = require('./db/User');
var Venue = require('./db/Venue');

mongoose.connect('mongodb://localhost/wazkraken');
Venue.find().remove().exec();
User.find().remove().exec();
Comment.find().remove().exec();

var user1 = new User({
  token: 'lol',
  coordinates: '37.783699,-122.409023'
});
user1.save();

var user2 = new User({
  token: 'wat',
  coordinates: '37.781175,-122.406243'
});
user2.save();

var hackreactor = new Venue({
  title: 'Hack Reactor',
  description: 'The CS degree for the 21st century',
  address: '944 Market St. #8, San Francisco, CA',
  coordinates: '37.783585,-122.408955',
  creator: user1.id,
  datetime: new Date().toISOString()
});
hackreactor.save();

var tempest = new Venue({
  title: 'Tempest',
  description: 'No-frills watering hole',
  address: '431 Natoma St., San Francisco, CA',
  coordinates: '37.7811679,-122.4062895',
  creator: user2.id,
  datetime: new Date().toISOString()
});
tempest.save();

mongoose.connection.close();
