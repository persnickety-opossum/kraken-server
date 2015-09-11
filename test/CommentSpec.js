var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../server.js');

var User = require('../db/User');
var Venue = require('../db/Venue')

describe('Comment Routes', function() {

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

  })
  
});
