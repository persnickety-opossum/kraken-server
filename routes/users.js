var express    = require('express');
var router     = express.Router();

var Venue      = require('./../db/Venue');
var User       = require('./../db/User');
var Comment    = require('./../db/Comment');

router.get('/', function(req, res) {
  User.find({})
    .exec(function(err, users){
      res.json(users);
    });
});

router.get('/userInfo/:userId', function(req, res) {
  Comment.find({
    "creator": req.params.userId
  })
    .populate('venue')
    .exec(function(err, comments) {
      res.send(comments);
    })
});

// Return specific user by ID
router.get('/:id', function(req, res){
  var user_id = req.params.id;
  User.findById(user_id).populate('venues')
    .exec(function(err, user){
      res.send(user);
    });
});

//for testing POST
router.post('/', function(req, res) {
  var data = req.body;
  var addUser = User.findOrCreate({
    token: data.token
  },
  function(err, user, created) {
    res.send(user);
  });
});


module.exports = router;