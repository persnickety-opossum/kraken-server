var express = require('express');
var https = require('https');
var router = express.Router();
var app = express();

if(!(process.env.production || process.env.TRAVIS)) var config = require('../config');
var fsID = process.env.FSQR_ID || config.fs.id;
var fsSecret = process.env.FSQR_SECRET || config.fs.secret;

var request = require('request');

// require databases in case we need to access this information to compare to radius search
var Venue = require('./../db/Venue');

// helper function to map relevant venue data to array
var mapData = function(body) {
  var data = JSON.parse(body);
    return data.response.venues.map(function(venue) {
      if (venue) {
        if (venue.categories[0]) {
          return {
            'id': venue.id,
            'title': venue.name,
            'description': venue.categories[0].name || '',
            'latitude': venue.location.lat,
            'longitude': venue.location.lng,
            'address': venue.location.formattedAddress.join(', ')
          };
        }
      }
  });
};

// api search request to search by keyword
router.get('/query/:query/:latlong', function(req, res) {
  request('https://api.foursquare.com/v2/venues/search?ll=' + req.params.latlong +
    '&query=' + req.params.query +
    '&client_id=' + fsID +
    '&client_secret=' + fsSecret +
    '&v=20150831' +
    '&limit=10',
    function(error, response, body) {
      if(!error && response.statusCode == 200) {
        res.send(mapData(body));
      }
    });
});

// sample search request for HR: http://localhost:8000/api/search/radius/1/37.783542,-122.408943/
// api search request by radius based on long/lat input
router.get('/radius/:radius/:latlong', function(req, res) {
  request('https://api.foursquare.com/v2/venues/search?ll=' + req.params.latlong +
    '&radius=' + req.params.radius +
    '&client_id=' + fsID +
    '&client_secret=' + fsSecret +
    '&v=20150831' +
    '&limit=10',
    function(error, response, body) {
      if(!error && response.statusCode == 200) {
        res.send(mapData(body));
      }
    });
});

module.exports = router;