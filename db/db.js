// Bring Mongoose into the app 
var mongoose = require( 'mongoose' );

if (!process.env.production) {
  var config = require('../config');
}
// Get the connection string 
var dbURI = process.env.DB_URI || 'mongodb://localhost/wazkraken'

// Create the database connection 
var db = mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose Connected!');
});

module.exports = db;