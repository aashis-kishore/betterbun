const supertest = require('supertest');
const app = require('../../app');

const request = supertest(app);

describe('Requests to known existent resources', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should have response status 404', async () => {
    const response = await request.get('/non/existent/route');

    expect(response.status).toBe(404);
  });

  it('should have expected response message', async () => {
    const response = await request.get('/non/existent/route');

    expect(response.header['Content-Type']).toMatch(/json/);
    expect(response.body.message).toMatch('Resource not found');
  });
});
