"use strict";

/**
 * End-to-end tests for the API endpoints
 *
 * @group e2e
 */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jest/expect-expect, jest/no-done-callback */
const request = require("supertest");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const app = require("./server");
const routes = require("./routes");

const wordsPerRequest = 10;

app.use(routes);

describe("the API", () => {
  let stub;

  const requestToApp = request(app);
  const expectedWord = {
    id: expect.any(Number),
    lemma: expect.any(String),
    english: expect.any(String),
    questionType: expect.any(String),
  };
  const bearer = "Bearer inMind";

  beforeAll(() => {
    stub = sinon.stub(jwt, "verify").callsFake(() => ({ id: 1 }));
  });
  afterAll(() => stub.restore());

  it("does not reply to GET /", (done) =>
    requestToApp.get("/").expect(StatusCodes.NOT_FOUND, done));
  it("replies to GET /words/learn with 200", (done) =>
    requestToApp
      .get("/words/learn")
      .set("Authorization", bearer)
      .expect("Content-Type", /json/u)
      .expect(StatusCodes.OK, done));
  it("sends the correct body in response to GET /words/learn", async (done) => {
    const { body } = await requestToApp
      .get("/words/learn")
      .set("Authorization", bearer);

    expect(body).toBeInstanceOf(Array);
    expect(body).toHaveLength(wordsPerRequest);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ...expectedWord, learned: false }),
      ])
    );
    done();
  });

  it("sends the correct body in response to GET /words/review", async (done) => {
    // Simulate signing up and learning 10 words
    await requestToApp.post("/signup").send({
      email: "foo@foo.com",
      password: "123456",
      confirmPassword: "123456",
    });
    await requestToApp
      .post("/words")
      .send(Array.from({ length: 10 }, (_x, index) => index + 1))
      .set("Authorization", bearer);

    const { body } = await requestToApp
      .get("/words/review")
      .set("Authorization", bearer);

    expect(body).toBeInstanceOf(Array);
    expect(body).toHaveLength(wordsPerRequest);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ...expectedWord, learned: true }),
      ])
    );
    done();
  });
});
