var express    = require('express');
var https      = require('https');
var router     = express.Router();
var app        = express();

var request = require('request');

var client_id = process.env.FSQR_ID || ''
var client_secret = process.env.FSQR_SECRET || ''

// require databases in case we need to access this information to compare to radius search
var Venue      = require('./../db/Venue');
// var User       = require('./../db/User');
// var Comment    = require('./../db/Comment');

var options = {
  url: 'https://api.github.com/repos/request/request',
  headers: {
    'User-Agent': 'request',
    'content-type': 'text/json'
  }
};

// helper function to map relevant venue data to array
var mapData = function(body) {
  var data = JSON.parse(body);
  return data.response.venues.map(function(venue) {
    return {
      'id': venue.id, 
      'title': venue.name, 
      'coordinates': venue.location.lat + ',' + venue.location.lng, 
      'address': venue.location.formattedAddress
    };
  })
};

// api search request to search by keyword
router.get('/query/:query/:latlong', function(req, res){
  // 
  request('https://api.foursquare.com/v2/venues/search?ll=' + req.params.latlong + 
          '&query=' + req.params.query + 
          '&client_id=' + client_id + 
          '&client_secret=' + client_secret + 
          '&v=20150831' +
          '&limit=10', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(JSON.parse(body).length);

      res.send(mapData(body));
    }
  });
});

// sample search request for HR: http://localhost:8000/api/search/radius/1/37.783542,-122.408943/

// api search request by radius based on long/lat input
router.get('/radius/:radius/:latlong', function(req, res){
  request('https://api.foursquare.com/v2/venues/search?ll=' + req.params.latlong + 
          '&radius=' + req.params.radius + 
          '&client_id=' + client_id + 
          '&client_secret=' + client_secret + 
          '&v=20150831' +
          '&limit=10', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(mapData(body));
    }
  });
});

module.exports = router;