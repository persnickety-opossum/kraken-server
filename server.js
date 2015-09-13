var express     = require('express');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');

var path        = require('path');
//var auth        = require('./utils/authenticate');

// Load the models
var Comment     = require('./db/Comment');
var Medium     = require('./db/Medium');
var Venue       = require('./db/Venue');
var User        = require('./db/User');

// Load routes
var venuesRoute   = require('./routes/venues');
var usersRoute    = require('./routes/users');
var commentsRoute = require('./routes/comments');
var searchRoute = require('./routes/search');
var mediaRoute = require('./routes/media');

var app = express();

app.use(bodyParser.json());

// Define routes
app.use('/api/venues', venuesRoute);
app.use('/api/users', usersRoute);
app.use('/api/comments', commentsRoute);
app.use('/api/search', searchRoute);
app.use('/api/media', mediaRoute);

app.set('port', (process.env.PORT || 5000));

// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });

// SOCKETS
var server = require('http').Server(app);

// Using global for now as I'm having issues exporting a module
global.socket = require('socket.io')(server);

module.exports = {
  app: app,
  server: server
};