var express = require('express')
var router  = express.Router();
var multer  = require('multer')
var aws     = require('aws-sdk');
var request = require('request');
var crypto  = require('crypto');
var mime    = require('mime');

// Models
var Comment = require('./../db/Comment');
var Medium  = require('./../db/Medium');
var Venue   = require('./../db/Venue');
var User    = require('./../db/User');

if(!process.env.production) var config = require('../config');

// Setting up AWS Credentials
var AWS_ACCESS_KEY = process.env.S3_ACCESS || config.aws.access;
var AWS_SECRET_KEY = process.env.S3_SECRET || config.aws.secret;
var S3_BUCKET = 'persnickety/media';

// Returns a list of media for a venue
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

var storage = multer.memoryStorage(); // Stores uploaded files in memory/buffer
router.post('/', multer({ storage: storage }).single('file'), function (req, res, next) {

  aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
  var s3bucket = new aws.S3({params: {Bucket: S3_BUCKET}});

  // Generate random filename
  crypto.pseudoRandomBytes(8, function (err, raw) {
    if (raw && req.file) {
      var filename = raw.toString('hex') + '.' + mime.extension(req.file.mimetype)
      // Upload to AWS
      s3bucket.createBucket(function() {
        var params = {Key: filename, Body: req.file.buffer};
        s3bucket.upload(params, function(err, data) {
          if (err) {
            console.log("Error uploading data: ", err);
            res.status(500).end();
          } else {

            // Creating new Medium
            var addMedium = Medium.create({
              path: data.Location,
              creator: req.body.creator,
              venue: req.body.venue,
              datetime: new Date(),
              atVenue: req.body.atVenue || false,
              mimetype: req.file.mimetype
            }, 
            // Adding Medium to Venue
            function(err, newMedium) {
              if (newMedium) {
                Venue.findById(req.body.venue, function(err, venue) {
                  if (venue) {
                    venue.media.push(newMedium._id);
                    venue.save(function(err) {
                      if (err) console.log(err);
                      else {
                        global.socket.emit('media1'/*, { hello: 'world' } pass in data here? */);
                        res.status(200).send('OK!');
                      }
                    });
                  } else {
                    console.log(err);
                  }
                })
              }
              if (err) {
                res.status(500).send(err);
              }
            });
        
          }
        }); // s3bucket.upload
      }); // s3bucket.createBucket
    } // if (raw)
    else {
      res.status(500).send('No data received...');
    }
  });

});

module.exports = router;