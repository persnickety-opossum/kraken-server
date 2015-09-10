var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../server.js');

describe('User Routes', function() {

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
});
