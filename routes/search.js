var express    = require('express');
var https      = require('https');
var router     = express.Router();
var app        = express();

var request = require('request');

// Todo: Dummy account, not for production!
var client_id = "S1HUKZ1HASCFAUN4XNZ5CATSOCY1TCF4FHCSILG2NO2RKWLE";
var client_secret = "OAGV3H2O3EDCHVOHPI203B3K1SOC0LNZUDXW2NBMKS2RICO1";

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

// {"meta":{"code":200,"requestId":"55e51ab3498ed0534d66a8df"},"response":{"venues":[{"id":"4d9cdcf7c99fb60c8cdbba8b","name":"LaLanne Fitness CrossFit","contact":{"phone":"4155127645","formattedPhone":"(415) 512-7645","twitter":"lalannefitness"},"location":{"address":"960 Howard St","crossStreet":"btwn 5th St & 6th St","lat":37.78094982759327,"lng":-122.40654963435571,"distance":56,"postalCode":"94103","cc":"US","city":"San Francisco","state":"CA","country":"United States","formattedAddress":["960 Howard St (btwn 5th St & 6th St)","San Francisco, CA 94103","United States"]},"categories":[{"id":"4bf58dd8d48988d175941735","name":"Gym \/ Fitness Center","pluralName":"Gyms or Fitness Centers","shortName":"Gym \/ Fitness","icon":{"prefix":"https:\/\/ss3.4sqi.net\/img\/categories_v2\/building\/gym_","suffix":".png"},"primary":true}],"verified":false,"stats":{"checkinsCount":2141,"usersCount":247,"tipCount":6},"url":"http:\/\/www.lalannefitness.com","hasMenu":true,"menu":{"type":"Products","label":"Products","anchor":"View Products","url":"https:\/\/foursquare.com\/v\/lalanne-fitness-crossfit\/4d9cdcf7c99fb60c8cdbba8b\/menu","mobileUrl":"https:\/\/foursquare.com\/v\/4d9cdcf7c99fb60c8cdbba8b\/device_menu"},"allowMenuUrlEdit":true,"specials":{"count":0,"items":[]},"hereNow":{"count":1,"summary":"One other person is here","groups":[{"type":"others","name":"Other people here","count":1,"items":[]}]},"referralId":"v-1441077939"},{"id":"4d49af2ff53c8cfa6f0b1b47","name":"Off the Grid: 5M @ Fifth and Minna","contact":{},"location":{"address":"410 Minna Street","crossStreet":"btwn 5th & Mary St","lat":37.78448545557364,"lng":-122.40399415918604,"distance":505,"postalCode":"94123","cc":"US","city":"San Francisco","state":"CA","country":"United States","formattedAddress":["410 Minna Street (btwn 5th & Mary St)","San Francisco, CA 94123","United States"]},"categories":[{"id":"53e0feef498e5aac066fd8a9","name":"Street Food Gathering","pluralName":"Street Food Gatherings","shortName":"Street Food Gathering","icon":


// http://localhost:8000/api/search/radius/1000/37.7806521,-122.4070723/
router.get('/radius/:radius/:longlat', function(req, res){
  request('https://api.foursquare.com/v2/venues/search?ll=' + req.params.longlat + 
          '&radius=' + req.params.radius + 
          '&client_id=' + client_id + 
          '&client_secret=' + client_secret + 
          '&v=20150831', function (error, response, body) {
    if (!error && response.statusCode == 200) {

      res.send(JSON.parse(body)['response']['venues'].map(function(venue) {
        return {'id': venue.id, 'name': venue.name, 'll': venue.location.lat + ',' + venue.location.lng, 'address': venue.location.formattedAddress};
      }));
      
    }
  })

  
});


module.exports = router;