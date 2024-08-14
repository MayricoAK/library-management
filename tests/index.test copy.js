const request = require('supertest');
const app = require('../index');
const req = request(app);
const mongoose = require('mongoose');

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Members test', function() {
    it('get all members', function(done) {
        req
        .get('/members')
        .expect(200, done);
    });
    it('add a new member', function(done) {
      req
      .post('/members')
      .send({
        code: 'M004',
        name: 'Azazelz'
      })
      .expect(201, done);
    });
    it('get borrowed books count for a member', function(done) {
      req
      .get('/members/M001')
      .expect(200, done);
    });
    it('delete specified member', function(done) {
      req
      .delete('/members/M004')
      .expect(200, done);
    });
});

describe('Books test', function() {
  it('get all available books', function(done) {
      req
      .get('/books')
      .expect(200, done);
  });
});