var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8000, function() {
  console.log('Sockets running!')
});

module.exports = io;