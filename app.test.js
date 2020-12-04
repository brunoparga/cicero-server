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
  const requestToApp = request(app);

  it("does not reply to GET /", (done) =>
    requestToApp.get("/").expect(StatusCodes.NOT_FOUND, done));

  describe("replies to routes within /words", () => {
    let stub;

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

    it("with 200 to GET /learn", (done) =>
      requestToApp
        .get("/words/learn")
        .set("Authorization", bearer)
        .expect("Content-Type", /json/u)
        .expect(StatusCodes.OK, done));

    it("with the correct body in response to GET /learn", async (done) => {
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

    it("with the correct body in response to GET /review", async (done) => {
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

  describe("replies to routes within /users", () => {
    it("rejects non-matching password confirmation on POST /signup", () => {
      const body = {
        email: "foo@foo.com",
        password: "1234",
        confirmPassword: "1234567891011121314",
      };

      return requestToApp
        .post("/signup")
        .send(body)
        .expect(StatusCodes.FORBIDDEN);
    });
  });

  it("rejects invalid email on POST /signin", async () => {
    await requestToApp.post("/signup").send({
      email: "foo@foo.com",
      password: "123456",
      confirmPassword: "123456",
    });

    return requestToApp
      .post("/signin")
      .send({
        email: "bar@foo.com",
        password: "123456",
      })
      .expect(StatusCodes.FORBIDDEN);
  });

  it("rejects invalid password on POST /signin", async () => {
    await requestToApp.post("/signup").send({
      email: "foo@foo.com",
      password: "123456",
      confirmPassword: "123456",
    });

    return requestToApp
      .post("/signin")
      .send({
        email: "foo@foo.com",
        password: "obviously wrong password but @ctually safer 73",
      })
      .expect(StatusCodes.FORBIDDEN);
  });
});
