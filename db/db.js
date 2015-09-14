// Bring Mongoose into the app 
var mongoose = require( 'mongoose' );

var dbURI = null;

if (process.env.TRAVIS) {
  dbURI = 'mongodb://localhost/wazkraken';
}
else if (process.env.production) {
  // Get the connection string 
  dbURI = process.env.DB_URI;
}
else {
  var config = require('../config');
  dbURI = config.dbURI;
}
// Create the database connection 
var db = mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose Connected!');
});

module.exports = db;