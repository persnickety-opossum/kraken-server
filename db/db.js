// Bring Mongoose into the app 
var mongoose = require( 'mongoose' );

// Get the connection string 
var dbConnection = process.env.DB || ''

// Create the database connection 
var db = mongoose.connect(dbConnection);

mongoose.connection.on('connected', function () {
  console.log('Mongoose Connected!');
});

module.exports = db;