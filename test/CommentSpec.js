var expect = require('chai').expect;
var supertest = require('supertest');
var mongoose = require('mongoose');
var app = require('../server').app;
app.set('port', 8080);
var server = require('../server').server;

var User = require('../db/User');
var Venue = require('../db/Venue');
var Comment = require('../db/Comment');

describe('Comment Routes', function() {

  var user = null;
  var venue = null;

  before(function (done) {
    var db = mongoose.connect('mongodb://localhost/kraken-test', function() {
      console.log('Mongoose Connected!');
      User.findOrCreate({token: 'testing123'}, function (err, newUser, created) {
        user = newUser;
        venue = new Venue({
          title: 'Catlantis',
          foursquareID: '123test',
          description: 'Mythical City of Cats',
          address: 'The Origin, Atlantic Ocean',
          latitude: 0,
          longitude: 0,
          creator: user._id,
          datetime: new Date()
        });
        venue.save(function() {
          new Comment({
            content: 'hey',
            creator: user._id,
            venue: venue._id,
            datetime: new Date(),
            atVenue: true,
            color: '#00FF00',
            icon: 'money'
          }).save(function() {
            server.listen(app.get('port'), function() {
              console.log('Server running...', app.get('port'));
              done()
            });
          });
        });
      });
    });
  });

  after(function() {
    User.find().remove().exec();
    Venue.find().remove().exec();
    Comment.find().remove().exec();
    mongoose.connection.close();
  });

  describe('GET /api/comments', function() {

    it('should respond with a status code of 200', function (done) {
      supertest(app).get('/api/comments')
      .expect(200, done);
    });

    it('should respond with a JSON array of comment objects', function (done) {
      supertest(app).get('/api/comments')
      .end(function (err, res) {
        expect(res.body).to.be.an('array');
        var comment = res.body[0];
        expect(comment).to.be.an('object');
        expect(comment).to.contain.all.keys('content', 'flags', 'datetime');
        done();
      });
    });

  });

  describe('POST /api/comments', function() {

    it('should respond with the new comment object', function (done) {
      supertest(app).post('/api/comments')
      .send({
        content: 'lol, cats',
        creator: user._id,
        venue: venue._id,
        datetime: new Date(),
        atVenue: true,
        color: '#00FF00',
        icon: 'money'
      })
      .end(function (err, res) {
        var comment = res.body;
        expect(comment).to.be.an('object');
        expect(comment).to.have.property('_id');
        expect(comment.content).to.equal('lol, cats');
        done();
      });
    });

    it('should cause subsequent GET responses to include the new comment', function (done) {
      supertest(app).post('/api/comments')
      .send({
        content: 'lol, cats',
        creator: user._id,
        venue: venue._id,
        datetime: new Date(),
        atVenue: true,
        color: '#00FF00',
        icon: 'money'
      })
      .end(function (err, res) {
        var comment = res.body;
        supertest(app).get('/api/comments')
        .end(function (err, res) {
          expect(res.body).to.include(comment);
          done();
        });
      });
    });
  });

  describe('GET /api/comments/:id', function() {
    it('should respond with the comment with the specified ID', function (done) {
      supertest(app).post('/api/comments')
      .send({
        content: 'lol, cats',
        creator: user._id,
        venue: venue._id,
        datetime: new Date(),
        atVenue: true,
        color: '#00FF00',
        icon: 'money'
      })
      .end(function (err, res) {
        var comment = res.body;
        supertest(app).get('/api/comments/' + comment._id)
        .end(function (err, res) {
          expect(res.body).to.eql(comment);
          done();
        });
      });
    });

    it('should respond with an empty object if the specified comment does not exist', function (done) {
      supertest(app).get('/api/comments/rofflewaffle')
      .end(function (err, res) {
        expect(res.body).to.eql({});
        done();
      });
    });
  });
  
});
