var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String
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
  flags: [{
    type: String,
    default: []
  }],
  color: {
    type: String
  },
  icon: {
    type: String
  }
}, {minimize: false});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
