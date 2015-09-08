var mongoose = require('mongoose');

var MediumSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  venue: {
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Venue'
  },
  datetime: {
    type: Date,
    required: true
  },
  atVenue: {
    type: Boolean
  },
  votes: {
    type: Number,
    default: 0
  },
  mimetype: {
    type: String,
    default: 'image/jpeg'
  }
});

var Medium = mongoose.model('Medium', MediumSchema);

module.exports = Medium;
