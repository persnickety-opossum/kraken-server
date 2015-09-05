var mongoose = require('mongoose');

var VenueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  attendees: {
    type: Number,
    default: 0
  },
  ratings: [{
    rating: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
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
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  datetime: {
    type: Date,
    required: true
  }
});

var Venue = mongoose.model('Venue', VenueSchema);

module.exports = Venue;

