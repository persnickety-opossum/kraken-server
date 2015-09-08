var express = require('express')
var router = express.Router();
var multer  = require('multer')
var Comment     = require('./../db/Comment');
var Medium     = require('./../db/Medium');
var Venue       = require('./../db/Venue');
var User        = require('./../db/User');

var crypto = require('crypto');
var mime = require('mime');


router.get('/', function (req, res) {
  var mediaList = [];
  Medium.find({'venue': req.query.venue}, function(err, media) {
    if (media) {
      media.forEach(function(medium) {
        if (medium.path !== undefined) mediaList.push(medium.path);
      });
      res.send(mediaList);
    }
    else {
      res.status(404).send('Venue not found!');
    }
  });
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './media/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(8, function (err, raw) {
      cb(null, Date.now() + '-' + raw.toString('hex') + '.' + mime.extension(file.mimetype));
    });
  }
});

router.post('/', multer({ storage: storage }).single('file'), function (req, res, next) {
  console.log(req.file);
  var addMedium = Medium.create({
    path: req.file.path,
    creator: req.body.creator,
    venue: req.body.venue,
    datetime: new Date(),
    atVenue: req.body.atVenue || false,
    mimetype: req.file.mimetype
  }, 
  function(err, newMedium) {
    if (newMedium) {
      Venue.findById(req.body.venue, function(err, venue) {
        if (venue) {
          venue.media.push(newMedium._id);
          venue.save(function(err) {
            if (err) console.log(err);
            res.status(200).send('OK!');
          });
        }
      })
    }
    if (err) {
      res.status(500).send(err);
    }
  });
})

module.exports = router;