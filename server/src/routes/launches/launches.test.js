const request = require('supertest');
const app = require('../../app.js');
const {
  connectToMongoDB,
  disconnectMongoDB,
} = require('../../services/mongo.js');

describe('Launches API', () => {
  // conectate al servidor de mongo antes de cada test
  beforeAll(async () => {
    await connectToMongoDB();
  });
  // desconectarse de mongo cuando termine el test
  // afterAll(async () => {
  //   await disconnectMongoDB();
  // });
  describe('Test GET /launches', () => {
    test('It should respond with 200success', async () => {
      const response = await request(app).get('/launches');
      expect(response.statusCode).toBe(200);
    });
  });

  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'testing',
      rocket: 'testing',
      destination: 'Kepler-1649 b',
      launchDate: 'January 4,2028',
    };

    const incompleteLaunchData = {
      mission: 'testing',
      rocket: 'testing',
    };
    // en estos test se manda una req a la api

    // a veces se crea una base de datos solo para tests (mundo ideal)
    // otras veces se hace un mock y se hace un intercept

    test('It should respond with 201 success', async () => {
      const response = await request(app)
        .post('/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const formatDateObject = {
        ...completeLaunchData,
        launchDate: new Date(completeLaunchData.launchDate).toISOString(),
      };

      expect(response.body).toMatchObject(formatDateObject);
    });

    test('It should catch missing required properties', async () => {
      // thanks to the request super test this works without calling again the response
      const response = await request(app)
        .post('/launches')
        .send(incompleteLaunchData)
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });
});
