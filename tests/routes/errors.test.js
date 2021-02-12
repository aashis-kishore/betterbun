const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../../app');
const { initDb } = require('../../lib/db');

const request = supertest(app);

describe('Requests to known existent resources', () => {
  beforeAll(async () => {
    const dbUri = 'mongodb+srv://imarkus:letmein123@learn-jasoj.mongodb.net/betterbun-test?retryWrites=true&w=majority';

    await initDb(dbUri);
  });

  afterAll(async () => {
    await mongoose.connection.close(true);
  });

  it('should have response status 404', async () => {
    const response = await request.get('/non/existent/route');

    expect(response.status).toBe(404);
  });

  it('should have expected response message', async () => {
    const response = await request.get('/non/existent/route');

    expect(response.body.errors[0].message).toMatch('Resource not found');
  });
});
