/* eslint-disable jest/expect-expect, jest/no-done-callback */
const request = require('supertest');

const app = require('./server');
const routes = require('./routes');

app.use(routes);

describe('the API', () => {
  it('does not reply to GET /', (done) => request(app).get('/').expect(404).end(done));
  it('replies to GET /words/learn with 200',
    (done) => request(app).get('/words/learn').expect(200).end(done));
});
