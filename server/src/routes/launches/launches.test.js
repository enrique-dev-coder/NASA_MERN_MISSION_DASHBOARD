const request = require('supertest');
const app = require('../../app.js');
// jest already have installed the funciton
describe('Test GET /launches', () => {
  test('It should respond with 200success', async () => {
    // lo que hacemos aqui es que te comunicas directament con el objeto app , con jest sin otra libreria se tiene que poner el path y todo eso
    const response = await request(app).get('/launches');
    expect(response.statusCode).toBe(200);
  });
});

describe('Test POST /launches', () => {
  const completeLaunchData = {
    mission: 'testing',
    rocket: 'testing',
    destination: 'testing',
    launchDate: 'January 4,2028',
  };

  const incompleteLaunchData = {
    mission: 'testing',
    rocket: 'testing',
  };

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
