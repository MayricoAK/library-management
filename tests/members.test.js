const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const Member = require('../models/Members');
const dotenv = require('dotenv');
dotenv.config();

beforeAll(async () => {
  const url = process.env.MONGO_URL;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await Member.deleteMany();
  await mongoose.connection.close();
});

describe('Members API', () => {
  it('should get all members', async () => {
    const res = await request(app).get('/members');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeDefined();
  });

  it('should add a new member', async () => {
    const res = await request(app)
      .post('/members')
      .send({
        code: 'M002',
        name: 'Another Member'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.member).toHaveProperty('_id');
  });

  it('should get borrowed books count for a member', async () => {
    const res = await request(app).get('/members/M002');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('Total');
  });

  it('should delete a member', async () => {
    const res = await request(app).delete('/members/M002');
    expect(res.statusCode).toEqual(200);
  });
});