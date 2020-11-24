/**
 * End-to-end tests for the API endpoints
 *
 * @group e2e
 */
/* eslint-disable jest/expect-expect, jest/no-done-callback */
const request = require('supertest');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const app = require('./server');
const routes = require('./routes');

app.use(routes);

describe('the API', () => {
  let stub;
  const req = request(app);
  const expectedWord = {
    id: expect.any(Number),
    lemma: expect.any(String),
    english: expect.any(String),
    questionType: expect.any(String),
  };

  beforeAll(() => {
    stub = sinon
      .stub(jwt, 'verify')
      .callsFake(() => ({ id: 1 }));
  });
  afterAll(() => stub.restore());

  it('does not reply to GET /', (done) => req.get('/').expect(404, done));
  it('replies to GET /words/learn with 200', (done) => req
    .get('/words/learn')
    .set('Authorization', 'Bearer inMind')
    .expect('Content-Type', /json/)
    .expect(200, done));
  it('sends the correct body in response to GET /words/learn', async (done) => {
    const { body } = await req.get('/words/learn').set('Authorization', 'Bearer inMind');
    expect(body).toBeInstanceOf(Array);
    expect(body).toHaveLength(10);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ...expectedWord, learned: false }),
      ]),
    );
    done();
  });

  it('sends the correct body in response to GET /words/review', async (done) => {
    // Simulate signing up and learning 10 words
    await req.post('/signup').send(
      { email: 'foo@foo.com', password: '123456', confirmPassword: '123456' },
    );
    await req
      .post('/words')
      .send([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      .set('Authorization', 'Bearer inMind');
    const { body } = await req.get('/words/review').set('Authorization', 'Bearer inMind');
    expect(body).toBeInstanceOf(Array);
    expect(body).toHaveLength(10);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ...expectedWord, learned: true }),
      ]),
    );
    done();
  });
});
