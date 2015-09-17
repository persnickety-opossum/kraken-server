var express     = require('express');
var router      = express.Router();

var Comment     = require('./../db/Comment');
var Venue       = require('./../db/Venue');
var User        = require('./../db/User');

//get all comments
router.get('/', function(req, res) {
  Comment.find({}).populate('creator').populate('venue')
    .exec(function(err, comments){
      res.json(comments);
    });
});

//get a specific comment
router.get('/:id', function(req, res){
  var comment_id = req.params.id;
  Comment.findById(comment_id).populate('creator').populate('venue')
    .exec(function(err, comment){
      res.send(comment);
    });
});

// Expect POST object like:
// {
//   content: "Comment text",
//   creator: "55e39290c2b4e82b4839046a", // ID of the user posting the comment
//   venue: "55e394d6c2b4e82b48390473", // ID of the event that the comment is associated with
//   datetime: "2016-03-30T06:20:46.000Z",
//   atVenue: true
// }

router.post('/', function(req, res) {

  var data = req.body;

  var addComment = Comment.create({
      content: data.content,
      creator: data.creator,
      venue: data.venue,
      datetime: data.datetime,
      atVenue: data.atVenue,
      color: data.color,
      icon: data.icon,
      flags: data.flags
    },
    function(err, newComment){
      // Add the comment_id to the comments array in the events model
      if (newComment) {
        Venue.findById(data.venue, function(err, venue){
          if (err) {
            console.log('Error posting comment.')
          }
          else if (venue) {
            venue.comments.push(newComment._id);
            if (data.atVenue) {
              venue.attendees[data.creator] = data.datetime;
              venue.markModified('attendees');
            }
            venue.save(function(err){
              //Saved!
              if (err) {
                console.log('Error saving venue with new comment.');
                return;
              }
              console.log('Successfully saved venue with new comment.');
              Comment.findById(newComment._id).populate('creator').populate('venue')
              .exec(function (err, comment) {
                res.send(comment);
              });
            });
          }
        });
      }
    });
});

router.post('/flag/:id', function(req, res) {
  var comment_id = req.params.id;
  Comment.findById(comment_id).then(function(comment) {
    if (req.body.shouldDelete) {
      Venue.findById(comment.venue).then(function(venue) {
        venue.comments.splice(venue.comments.indexOf(comment_id), 1);
        venue.save();
      });
      Comment.remove({_id: comment_id}, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('weeeee')
          res.send('');
        }
      });
    } else {
      comment.flags = req.body.flags;
      comment.markModified('flags');
      comment.save().then(function() {res.send(comment)});
    }
  })
  .catch(function(err) {
    console.log(err);
  });
});

module.exports = router;
