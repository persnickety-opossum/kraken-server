var expect = require('chai').expect;
var supertest = require('supertest');
var mongoose = require('mongoose');
var app = require('../server').app;
app.set('port', 8080);
var server = require('../server').server;

var User = require('../db/User');
var Venue = require('../db/Venue');

describe('Venue Routes', function() {

  var user = null;

  before(function (done) {
    var db = mongoose.connect('mongodb://localhost/kraken-test', function() {
      console.log('Mongoose Connected!');
      User.findOrCreate({token: 'testing123'}, function (err, newUser, created) {
        user = newUser;
        var venue = new Venue({
          title: "Santa's Workshop",
          description: 'Toy Factory',
          address: 'The North Pole',
          latitude: 90,
          longitude: 0,
          creator: user._id,
          datetime: new Date()
        });
        venue.save(function() {
          server.listen(app.get('port'), function() {
            console.log('Server running...', app.get('port'));
            done();
          });
        });
      });
    });
  });

  after(function() {
    User.find().remove().exec();
    Venue.find().remove().exec();
    mongoose.connection.close();
  });

  describe('GET /api/venues', function() {

    it('should respond with a status code of 200', function (done) {
      supertest(app).get('/api/venues')
      .expect(200, done);
    });

    it('should respond with a JSON array of venue objects', function (done) {
      supertest(app).get('/api/venues')
      .end(function (err, res) {
        expect(res.body).to.be.an('array');
        var venue = res.body[0];
        expect(venue).to.be.an('object');
        expect(venue).to.contain.all.keys('title', 'attendees', 'ratings',
          'latitude', 'longitude', 'comments', 'media', 'creator', 'datetime');
        done();
      });
    });
  });

  describe('POST /api/venues', function() {

    it('should respond with the new venue object', function (done) {
      User.findOrCreate({token: 'testing123'}, function (err, user, created) {
        supertest(app).post('/api/venues')
        .send({
          title: 'Catlantis',
          description: 'Mythical City of Cats',
          address: 'The Origin, Atlantic Ocean',
          latitude: 0,
          longitude: 0,
          creator: user._id,
          datetime: new Date()
        })
        .end(function (err, res) {
          var venue = res.body;
          expect(venue).to.be.an('object');
          expect(venue).to.have.property('_id');
          expect(venue.title).to.equal('Catlantis');
          done();
        });
      });
    });

    it('should cause subsequent GET responses to include the new venue', function (done) {
      User.findOrCreate({token: 'testing123'}, function (err, user, created) {
        supertest(app).post('/api/venues')
        .send({
          title: 'Catlantis',
          description: 'Mythical City of Cats',
          address: 'The Origin, Atlantic Ocean',
          latitude: 0,
          longitude: 0,
          creator: user._id,
          datetime: new Date()
        })
        .end(function (err, res) {
          var venue = res.body;
          supertest(app).get('/api/venues')
          .end(function (err, res) {
            expect(res.body).to.include(venue);
            done();
          });
        });
      });
    });

  });

  describe('GET /api/venues/:id', function() {

    it('should respond with the venue with the specified id', function (done) {
      User.findOrCreate({token: 'testing123'}, function (err, user, created) {
        supertest(app).post('/api/venues')
        .send({
          title: 'Catlantis',
          description: 'Mythical City of Cats',
          address: 'The Origin, Atlantic Ocean',
          latitude: 0,
          longitude: 0,
          creator: user._id,
          datetime: new Date()
        })
        .end(function (err, res) {
          var venue = res.body;
          supertest(app).get('/api/venues/' + venue._id)
          .end(function (err, res) {
            expect(res.body).to.eql(venue);
            done();
          });
        });
      });
    });

    it('should respond with an empty object if the specified venue does not exist', function (done) {
      User.findOrCreate({token: 'testing123'}, function (err, user, created) {
        supertest(app).post('/api/venues')
        .send({
          title: 'Catlantis',
          description: 'Mythical City of Cats',
          address: 'The Origin, Atlantic Ocean',
          latitude: 0,
          longitude: 0,
          creator: user._id,
          datetime: new Date()
        })
        .end(function (err, res) {
          supertest(app).get('/api/venues/rofflewaffle')
          .end(function (err, res) {
            expect(res.body).to.eql({});
            done();
          });
        });
      });
    });

  });

});
