const supertest = require('supertest');

const app = require('../../src/app');

describe('Edge case routes', () => {
  let request;

  beforeAll(() => {
    request = supertest(app);
  });

  describe('Requests to non-existent resources', () => {
    it('should have response status 404', async (done) => {
      await request
        .get('/non/existent/route')
        .expect(404);

      done();
    });

    it('should have expected response message', async (done) => {
      await request
        .get('/non/existent/route')
        .expect(res => {
          const data = res.body;
          expect(data.errors[0].message)
            .toMatch('Resource not found');

          done();
        });
    });
  });
});
