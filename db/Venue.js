var mongoose = require('mongoose');

var VenueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  foursquareID: {
    type: String,
    required: true
  },
  attendees: {
    type: Object,
    default: {}
  },
  ratings: {
    type: Object,
    default: {}
  },
  description: {
    type: String
  },
  address: {
    type: String
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  comments: [{
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: []
  }],
  media: [{
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Medium',
    default: []
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  datetime: {
    type: Date,
    required: true
  }
},
{minimize: false});

var Venue = mongoose.model('Venue', VenueSchema);

module.exports = Venue;

