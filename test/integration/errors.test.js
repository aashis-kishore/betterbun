const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../../src/app');

// describe('Edge case routes', () => {
describe('Requests to non-existent resources', () => {
  beforeAll(async () => {
    mongoose.Promise = Promise;
    const mongoUri = 'mongodb://mongoadmin:imtheadmin@mongodb/betterbun-db-test?authSource=admin';
    mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    mongoose.connection.on('error', () => {
      throw new Error(`Unable to connect to database: ${mongoUri}`);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should have response status 404', async (done) => {
    await request(app)
      .get('/non/existent/route')
      .expect(404);

    done();
  });

  it('should have expected response message', async (done) => {
    await request(app).get('/non/existent/route')
      .expect(res => {
        const data = res.body;
        expect(data.errors[0].message).toMatch('Resource not found');

        done();
      });
  });
});
// });
