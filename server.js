var express     = require('express');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var db          = require('./db/db');
//var auth        = require('./utils/authenticate');

// Load the models
var Comment     = require('./db/Comment');
var Venue       = require('./db/Venue');
var User        = require('./db/User');

// Load routes
var venuesRoute   = require('./routes/venues');
var usersRoute    = require('./routes/users');
var commentsRoute = require('./routes/comments');
var searchRoute = require('./routes/search');

var app = express();

//app.use(express.static(__dirname + '/../app'));

app.use(bodyParser.json());

// Define routes
app.use('/api/venues', venuesRoute);
app.use('/api/users', usersRoute);
app.use('/api/comments', commentsRoute);
app.use('/api/search', searchRoute);

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


module.exports = app;