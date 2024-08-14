const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

const req = request(app);

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Books API', () => {
  it('should get all available books', async () => {
    const res = await req.get('/books');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
  });

  it('should add a new book', async () => {
    const res = await req
      .post('/books')
      .send({
        code: 'B001',
        title: 'Test Book',
        author: 'Test Author',
        stock: 10
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('book');
  });

  it('should borrow a book', async () => {
    const res = await req
      .post('/books/borrow')
      .send({
        code: 'M001',
        bookCode: 'B001',
        borrowedDate: '15-08-2024'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('book');
  });

  it('should return a book', async () => {
    const res = await req
      .post('/books/return')
      .send({
        code: 'M001',
        bookCode: 'B001',
        returnedDate: '20-08-2024'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('book');
  });

  it('should delete a book', async () => {
    const res = await req.delete('/books/B001');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('book');
  });
});

describe('Members API', () => {
  it('should get all members', async () => {
    const res = await req.get('/members');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
  });

  it('should add a new member', async () => {
    const res = await req
      .post('/members')
      .send({
        code: 'M004',
        name: 'Azazelz'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('member');
  });

  it('should get borrowed books count for a member', async () => {
    const res = await req.get('/members/M001');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('Total');
  });

  it('should delete a member', async () => {
    const res = await req.delete('/members/M004');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('member');
  });
});