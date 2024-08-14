const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const Book = require('../models/Books');
const Member = require('../models/Members');
const dotenv = require('dotenv');
dotenv.config();

beforeAll(async () => {
  // Setup database test
  const url = process.env.MONGO_URL;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Clean up database after tests
  await Book.deleteMany();
  await Member.deleteMany();
  await mongoose.connection.close();
});

describe('Books API', () => {
  it('should get all available books', async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeDefined();
  });

  it('should add a new book', async () => {
    const res = await request(app)
      .post('/books')
      .send({
        code: 'B001',
        title: 'Test Book',
        author: 'John Doe',
        stock: 10
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.book).toHaveProperty('_id');
  });

  it('should borrow a book', async () => {
    const member = await Member.create({ code: 'M001', name: 'Jane Doe' });
    await Book.create({ code: 'B002', title: 'Another Test Book', author: 'John Doe', stock: 5 });

    const res = await request(app)
      .post('/books/borrow')
      .send({
        code: 'M001',
        bookCode: 'B002',
        borrowedDate: '10-08-2024'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.book).toHaveProperty('borrowedBy', member._id.toString());
  });

  it('should return a book', async () => {
    const member = await Member.findOne({ code: 'M001' });
    const res = await request(app)
      .post('/books/return')
      .send({
        code: 'M001',
        bookCode: 'B002',
        returnedDate: '17-08-2024'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.book).toHaveProperty('borrowedBy', null);
  });

  it('should delete a book', async () => {
    const res = await request(app).delete('/books/B001');
    expect(res.statusCode).toEqual(200);
  });
});