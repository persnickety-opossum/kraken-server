var db = require('./db/db');
var server = require('./server').server;
var app = require('./server').app;
var tasks = require('./db/tasks');

server.listen(app.get('port'), function() {
  console.log('Server running...', app.get('port'));
});

setInterval(tasks.checkAttendees, 300000);
