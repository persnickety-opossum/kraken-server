var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../server.js');

var User = require('../db/User');

describe('Venue Routes', function() {

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
});
