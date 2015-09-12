var expect = require('chai').expect;
var supertest = require('supertest');
var mongoose = require('mongoose');
var app = require('../server').app;
app.set('port', 8080);
var server = require('../server').server;

var User = require('../db/User');

describe('User Routes', function() {

  before(function (done) {
    var db = mongoose.connect('mongodb://localhost/kraken-test');

    mongoose.connection.on('connected', function () {
      console.log('Mongoose Connected!');
      User.findOrCreate({token: 'testing12'}, function (err, newUser, created) {
        server.listen(app.get('port'), function() {
          console.log('Server running...', app.get('port'));
          done()
        });
      });
    });
  });

  after(function() {
    User.find().remove().exec();
  })

  describe('GET /api/users', function() {

    it('should respond with a status code of 200', function (done) {
      supertest(app).get('/api/users')
      .expect(200, done);
    });

    it('should respond with a JSON array of user objects', function (done) {
      supertest(app).get('/api/users')
      .end(function (err, res) {
        expect(res.body).to.be.an('array');
        var user = res.body[0];
        expect(user).to.be.an('object');
        expect(user).to.have.property('token');
        done();
      });
    });
  });

  describe('POST /api/users', function() {

    it('should respond with the new user object', function (done) {
      supertest(app).post('/api/users')
      .send({token: 'testing123'})
      .end(function (err, res) {
        var user = res.body;
        expect(user).to.be.an('object');
        expect(user).to.have.property('_id');
        expect(user.token).to.equal('testing123');
        done();
      })
    });

    it('should cause subsequent GET responses to include the new user', function (done) {
      supertest(app).post('/api/users')
      .send({token: 'testing123'})
      .end(function (err, res) {
        var user = res.body;
        supertest(app).get('/api/users')
        .end(function (err, res) {
          expect(res.body).to.include(user);
          done();
        });
      });
    });

    it('should be idempotent', function (done) {
      supertest(app).post('/api/users')
      .send({token: 'testing123'})
      .end(function (err, res) {
        var user = res.body;
        supertest(app).post('/api/users')
        .send({token: 'testing123'})
        .end(function (err, res) {
          expect(res.body).to.eql(user);
          done();
        });
      });
    });
  });

  describe('GET /api/users/:id', function() {

    it('should respond with the user with the specified id', function (done) {
      supertest(app).post('/api/users')
      .send({token: 'testing123'})
      .end(function (err, res) {
        var user = res.body;
        supertest(app).get('/api/users/' + user._id)
        .end(function (err, res) {
          expect(res.body).to.eql(user);
          done();
        });
      });
    });

    it('should respond with an empty object if the specified user does not exist', function (done) {
      supertest(app).post('/api/users')
      .send({token: 'testing123'})
      .end(function (err, res) {
        supertest(app).get('/api/users/rofflewaffle')
        .end(function (err, res) {
          expect(res.body).to.eql({});
          done();
        });
      });
    });
  });
});
